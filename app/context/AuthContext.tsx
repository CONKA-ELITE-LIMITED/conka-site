'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setMetaUserData } from '@/app/lib/metaPixel';

export interface CustomerAddress {
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zoneCode: string | null;
  zip: string | null;
  country: string | null;
  territoryCode: string | null;
}

export interface CustomerInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  defaultAddress?: CustomerAddress | null;
}

interface AuthContextType {
  customer: CustomerInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = customer !== null;

  // Mirror the logged-in email into the Meta tracking layer (a non-React module)
  // so client CAPI events can attach it as a hashed match key — the single
  // strongest Event Match Quality signal. Cleared to null on logout.
  useEffect(() => {
    setMetaUserData(customer?.email ?? null);
  }, [customer]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Check session status
  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.authenticated && data.customer) {
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
    } catch (err) {
      console.error('Failed to check session:', err);
      setCustomer(null);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const initSession = async () => {
      await checkSession();
      setLoading(false);
    };

    initSession();
  }, [checkSession]);

  // Check for OAuth errors in URL (after redirect from Shopify)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      
      if (errorParam) {
        const errorMessages: Record<string, string> = {
          'access_denied': 'Login was cancelled',
          'invalid_state': 'Security validation failed. Please try again.',
          'missing_params': 'Login failed. Please try again.',
          'token_error': 'Failed to complete login. Please try again.',
          'callback_failed': 'Login failed. Please try again.',
          'config': 'Login is not configured properly.',
        };
        
        setError(errorMessages[errorParam] || 'Login failed. Please try again.');
        
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Login - redirects to OAuth authorization endpoint
  const login = useCallback(() => {
    // Redirect to our authorize endpoint which handles PKCE and redirects to Shopify
    window.location.href = '/api/auth/authorize';
  }, []);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Use GET to trigger the full logout flow with Shopify SSO logout
      window.location.href = '/api/auth/logout';
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state
      setCustomer(null);
      setError(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        checkSession,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

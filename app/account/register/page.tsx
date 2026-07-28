'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/navigation';
import { useAuth } from '@/app/context/AuthContext';

/**
 * Register Page
 *
 * With the new Customer Account API, registration is handled automatically
 * during the first login. This page now redirects to the login flow.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { login, loading, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleGetStarted = () => {
    clearError();
    login();
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      <main className="pt-24 pb-24 lg:pt-36 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <p className="text-sm font-medium text-black/50 mb-2">Account</p>
          <h1
            className="text-3xl font-semibold text-black mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Create Account
          </h1>
          <p className="text-sm text-black/60 mb-8">
            Join the CONKA community.
          </p>

          {/* Registration Card */}
          <div className="bg-white rounded-md border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 md:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-md border border-red-200 bg-red-50/50 p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm text-black/60">
                Creating an account is simple and secure. Just enter your email
                and we&apos;ll send you a one-time code.
              </p>
              <p className="text-sm text-black/75 mt-2 font-semibold">
                No password to remember. Ever.
              </p>
            </div>

            {/* Get Started Button */}
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold py-4 hover:opacity-90 disabled:opacity-50 transition-opacity mb-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                'Get Started'
              )}
            </button>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Track Orders */}
              <div className="p-4 rounded-md bg-[#f5f5f5] border border-black/10">
                <div className="w-10 h-10 rounded-md bg-white border border-black/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="text-black/50">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <p className="font-semibold text-sm text-black mb-1" style={{ letterSpacing: '-0.02em' }}>Track Orders</p>
                <p className="text-[13px] text-black/50">Real-time updates</p>
              </div>

              {/* Manage Subscriptions */}
              <div className="p-4 rounded-md bg-[#f5f5f5] border border-black/10">
                <div className="w-10 h-10 rounded-md bg-white border border-black/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="text-black/50">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                  </svg>
                </div>
                <p className="font-semibold text-sm text-black mb-1" style={{ letterSpacing: '-0.02em' }}>Subscriptions</p>
                <p className="text-[13px] text-black/50">Pause, skip, cancel</p>
              </div>

              {/* Faster Checkout */}
              <div className="p-4 rounded-md bg-[#f5f5f5] border border-black/10">
                <div className="w-10 h-10 rounded-md bg-white border border-black/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="text-black/50">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <p className="font-semibold text-sm text-black mb-1" style={{ letterSpacing: '-0.02em' }}>Fast Checkout</p>
                <p className="text-[13px] text-black/50">Saved address</p>
              </div>

              {/* Exclusive Access */}
              <div className="p-4 rounded-md bg-[#f5f5f5] border border-black/10">
                <div className="w-10 h-10 rounded-md bg-white border border-black/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="text-black/50">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <p className="font-semibold text-sm text-black mb-1" style={{ letterSpacing: '-0.02em' }}>Early Access</p>
                <p className="text-[13px] text-black/50">New products & offers</p>
              </div>
            </div>

            {/* Already have account */}
            <p className="text-center text-sm text-black/50 mt-6">
              Already have an account? The same button works for both!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

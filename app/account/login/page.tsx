'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/navigation';
import { useAuth } from '@/app/context/AuthContext';

const DEV_MOCK_ENABLED = process.env.NEXT_PUBLIC_DEV_MOCK_AUTH === 'true';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, clearError, isAuthenticated, checkSession } = useAuth();
  const [mockLoading, setMockLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    clearError();
    login();
  };

  const handleMockLogin = async () => {
    if (!DEV_MOCK_ENABLED) return;
    setMockLoading(true);
    clearError();
    try {
      const res = await fetch('/api/auth/dev-mock', { method: 'POST' });
      if (res.ok) {
        await checkSession();
        router.push('/account');
      }
    } finally {
      setMockLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      <main className="pt-24 pb-24 px-4 lg:px-[5vw]">
        <div className="mx-auto max-w-[28rem]">
          <p className="text-sm font-medium text-black/50 mb-2">Account</p>
          <h1
            className="text-2xl font-semibold text-black mb-1"
            style={{ letterSpacing: '-0.02em' }}
          >
            Sign in
          </h1>
          <p className="text-sm text-black/60 mb-6">
            Sign in to view orders, manage subscriptions, and update your details.
          </p>

          <div className="bg-white rounded-md border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6">
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50/50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <p className="text-sm text-black/60 mb-4">
              We&apos;ll send a one-time code to your email. No password.
            </p>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold py-3.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                'Continue with Email'
              )}
            </button>

            {DEV_MOCK_ENABLED && (
              <button
                type="button"
                onClick={handleMockLogin}
                disabled={mockLoading}
                className="w-full mt-3 rounded-full border border-black/10 hover:border-black/40 text-black text-[13px] font-medium py-3.5 transition-colors disabled:opacity-50"
              >
                {mockLoading ? 'Loading...' : 'Use mock account (dev)'}
              </button>
            )}

            <p className="mt-4 text-center text-sm text-black/60">
              <Link href="/" className="font-medium text-black underline hover:opacity-70">
                Continue as guest
              </Link>{' '}
              to checkout without an account.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

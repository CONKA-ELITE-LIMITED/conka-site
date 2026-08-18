import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { customerAuthRedirectUri } from '@/app/lib/customerAuthRedirect';

/**
 * Generate a cryptographically random string for PKCE
 */
function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Generate code challenge from verifier using SHA256
 */
function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

/**
 * Generate a random state parameter for CSRF protection
 */
function generateState(): string {
  return crypto.randomBytes(16).toString('base64url');
}

/**
 * Generate a random nonce for ID token validation
 */
function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64url');
}

/**
 * OAuth Authorization Endpoint
 * 
 * Redirects the user to Shopify's hosted login page.
 * Shopify handles the email OTP flow, then redirects back to /api/auth/callback
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;

  if (!clientId || !shopId) {
    return NextResponse.json(
      { error: 'Customer Account API not configured' },
      { status: 500 }
    );
  }

  // Callback URL: pinned via SHOPIFY_REDIRECT_URI when set (preview/ngrok),
  // else derived from the request origin.
  const origin = request.headers.get('origin') || request.nextUrl.origin;
  const redirectUri = customerAuthRedirectUri(origin);

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();
  const nonce = generateNonce();

  // Store PKCE verifier and state in cookies (HTTP-only for security)
  const cookieStore = await cookies();
  
  cookieStore.set('oauth_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  cookieStore.set('oauth_nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  // Build the authorization URL
  const authUrl = new URL(`https://shopify.com/authentication/${shopId}/oauth/authorize`);
  
  // Required OAuth parameters
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'openid email customer-account-api:full');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('nonce', nonce);
  
  // PKCE parameters (required for public clients)
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  // Redirect to Shopify's login page
  return NextResponse.redirect(authUrl.toString());
}


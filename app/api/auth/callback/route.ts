import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { customerAuthRedirectUri } from '@/app/lib/customerAuthRedirect';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

interface TokenErrorResponse {
  error: string;
  error_description?: string;
}

/**
 * OAuth Callback Endpoint
 * 
 * Handles the redirect from Shopify after successful authentication.
 * Exchanges the authorization code for access tokens.
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;

  if (!clientId || !shopId) {
    return NextResponse.redirect(new URL('/account/login?error=config', request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle error from Shopify
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/account/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(new URL('/account/login?error=missing_params', request.url));
  }

  // Get stored OAuth parameters from cookies
  const cookieStore = await cookies();
  const storedState = cookieStore.get('oauth_state')?.value;
  const codeVerifier = cookieStore.get('oauth_code_verifier')?.value;
  const storedNonce = cookieStore.get('oauth_nonce')?.value;

  // Validate state to prevent CSRF attacks
  if (!storedState || state !== storedState) {
    console.error('State mismatch:', { received: state, stored: storedState });
    return NextResponse.redirect(new URL('/account/login?error=invalid_state', request.url));
  }

  // Validate code verifier exists
  if (!codeVerifier) {
    console.error('Missing code verifier');
    return NextResponse.redirect(new URL('/account/login?error=missing_verifier', request.url));
  }

  // Must match the redirect_uri used at authorize (pinned via SHOPIFY_REDIRECT_URI
  // when set, else derived from the request origin).
  const redirectUri = customerAuthRedirectUri(request.nextUrl.origin);

  try {
    // Exchange authorization code for tokens
    const tokenUrl = `https://shopify.com/authentication/${shopId}/oauth/token`;
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData: TokenErrorResponse = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL(`/account/login?error=${encodeURIComponent(errorData.error || 'token_error')}`, request.url)
      );
    }

    const tokens: TokenResponse = await tokenResponse.json();

    // Validate nonce from ID token (basic validation)
    // In production, you should properly decode and validate the JWT
    if (storedNonce) {
      try {
        const idTokenPayload = JSON.parse(
          Buffer.from(tokens.id_token.split('.')[1], 'base64').toString()
        );
        if (idTokenPayload.nonce !== storedNonce) {
          console.error('Nonce mismatch');
          return NextResponse.redirect(new URL('/account/login?error=invalid_nonce', request.url));
        }
      } catch (e) {
        console.error('Failed to validate ID token:', e);
      }
    }

    // Calculate token expiry
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Create response with redirect to account page
    const response = NextResponse.redirect(new URL('/account', request.url));

    // Store tokens in HTTP-only cookies
    response.cookies.set('customer_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/',
    });

    response.cookies.set('customer_token_expires', expiresAt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/',
    });

    if (tokens.refresh_token) {
      response.cookies.set('customer_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    // Store ID token for client-side use (contains basic user info)
    response.cookies.set('customer_id_token', tokens.id_token, {
      httpOnly: false, // Accessible from client for user info
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/',
    });

    // Clear OAuth state cookies
    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_code_verifier');
    response.cookies.delete('oauth_nonce');

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/account/login?error=callback_failed', request.url));
  }
}


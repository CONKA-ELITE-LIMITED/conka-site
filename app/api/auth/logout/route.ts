import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Logout Endpoint
 * 
 * Clears all authentication cookies and optionally redirects to Shopify logout.
 * GET: Performs logout and redirects to login page
 * POST: Performs logout and returns JSON response
 */
export async function GET(request: NextRequest) {
  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
  const cookieStore = await cookies();
  const idToken = cookieStore.get('customer_id_token')?.value;
  const mockCookie = cookieStore.get('dev_mock_auth')?.value;
  const isDev = process.env.NODE_ENV === 'development';
  const mockAuthEnabled = process.env.DEV_MOCK_AUTH === 'true';

  // Clear all auth cookies
  const response = NextResponse.redirect(new URL('/account/login', request.url));
  
  response.cookies.delete('customer_access_token');
  response.cookies.delete('customer_token_expires');
  response.cookies.delete('customer_refresh_token');
  response.cookies.delete('customer_id_token');
  response.cookies.delete('dev_mock_auth');

  // If we have an ID token and shop ID, redirect to Shopify logout to end SSO session
  if (shopId && idToken && !(isDev && mockAuthEnabled && mockCookie)) {
    const postLogoutRedirect = `${request.nextUrl.origin}/account/login`;
    const logoutUrl = new URL(`https://shopify.com/authentication/${shopId}/logout`);
    logoutUrl.searchParams.set('id_token_hint', idToken);
    logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirect);
    
    return NextResponse.redirect(logoutUrl.toString());
  }

  return response;
}

export async function POST(_request: NextRequest) {
  const cookieStore = await cookies();

  // Clear all auth cookies including dev mock
  cookieStore.delete('customer_access_token');
  cookieStore.delete('customer_token_expires');
  cookieStore.delete('customer_refresh_token');
  cookieStore.delete('customer_id_token');
  cookieStore.delete('dev_mock_auth');

  return NextResponse.json({ success: true });
}

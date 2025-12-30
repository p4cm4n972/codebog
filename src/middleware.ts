import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppwriteServerClient } from './lib/appwrite-server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/profile', '/jsbog'];

  if (protectedRoutes.some(path => pathname.startsWith(path))) {
    try {
      const { account } = await AppwriteServerClient(request.cookies);
      await account.get();
      // If the user is authenticated, continue to the requested page
      return NextResponse.next();
    } catch {
      // If the user is not authenticated, redirect to the login page
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to continue for public routes
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile/:path*', '/jsbog/:path*'],
};
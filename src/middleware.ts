import { NextResponse } from 'next/server';

// DISABLED: Server-side authentication via middleware doesn't work with cross-domain Appwrite setup
// The session cookie is created by appwrite.itmade.fr and cannot be read by localhost:3000
// Protection is handled client-side in the page components instead

export async function middleware() {
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile/:path*', '/jsbog/:path*'],
};
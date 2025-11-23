import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Matcher logic implemented manually to avoid potential config issues
  const isProtectedPath = path.startsWith('/admin') || path.startsWith('/register');
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // 1. Protect Admin Routes
  if (path.startsWith('/admin')) {
    const authCookie = request.cookies.get('auth_token');
    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Protect Register Route
  if (path.startsWith('/register')) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/settings?key=registration_enabled`);
      if (response.ok) {
        const data = await response.json();
        if (data.value === 'false') {
           return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      console.error("Middleware settings check failed", error);
    }
  }

  return NextResponse.next();
}

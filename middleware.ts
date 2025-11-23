import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Protect Admin Routes
  if (path.startsWith('/admin')) {
    // Check for authentication cookie (simplified for now)
    const authCookie = request.cookies.get('auth_token');
    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Protect Register Route
  if (path.startsWith('/register')) {
    try {
      // Fetch global settings to check if registration is enabled
      // Note: Middleware runs on Edge, so we can't use Prisma directly easily without Edge Client.
      // For simplicity in this "portable" setup, we'll fetch via the API we are about to create.
      // OR, we can rely on the API route to block the actual registration POST, 
      // and here we just check a cookie or similar if we had one.
      // BUT, to redirect the PAGE load, we need to know the setting.
      
      // Strategy: We will let the page load, but the page itself will check the setting client-side 
      // and redirect if needed, OR we fetch from API here. Fetching in middleware can be tricky with relative URLs.
      // Let's use an absolute URL.
      const response = await fetch(`${request.nextUrl.origin}/api/settings?key=registration_enabled`);
      if (response.ok) {
        const data = await response.json();
        if (data.value === 'false') {
           return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      console.error("Middleware settings check failed", error);
      // Fallback: Allow access if check fails, or block? Let's allow for now to avoid lockout during dev.
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/register'],
};

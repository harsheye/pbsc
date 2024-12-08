import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check if user is logged in
    const isLoggedIn = request.cookies.get('isAdminLoggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If trying to access /admin, redirect to /admin/dashboard
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',  // Match all /admin routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Exclude certain paths
  ],
}; 
import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const sessionCookie = request.cookies.get('session');
  const { pathname } = request.nextUrl;
 
  // Allow access to the root landing page for everyone
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  
  // All other routes besides auth pages and the landing page are considered protected
  const isProtectedPage = !isAuthPage;
 
  // If trying to access a protected page without a session, redirect to login
  if (isProtectedPage && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  // If trying to access an auth page with a session, redirect to dashboard
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
 
  return NextResponse.next();
}
 
export const config = {
  // Match all routes except for API routes, static files, and image optimization files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

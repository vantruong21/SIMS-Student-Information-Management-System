// Standard Next.js (App Router) Middleware Specification for Role-Based Access Control (RBAC)
// To be used by the Next.js deployment or matched by client-side routing logic.

interface SimpleRequest {
  url: string;
  nextUrl: {
    pathname: string;
  };
  cookies: {
    get: (name: string) => { value: string } | undefined;
  };
}

export function middleware(request: SimpleRequest) {
  const pathname = request.nextUrl.pathname;
  const userCookie = request.cookies.get('user_session');
  
  let user: { role: 'Student' | 'Faculty' | 'Admin' } | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie.value));
    } catch (e) {
      user = null;
    }
  }

  // Redirect to login if accessing protected dashboard without being logged in
  const isDashboardRoute = pathname.startsWith('/admin') || pathname.startsWith('/faculty') || pathname.startsWith('/student');
  
  if (!user && isDashboardRoute) {
    return {
      redirect: '/login'
    };
  }

  if (user) {
    // 1. Admin route protection
    if (pathname.startsWith('/admin') && user.role !== 'Admin') {
      return { redirect: '/unauthorized' };
    }

    // 2. Faculty route protection
    if (pathname.startsWith('/faculty') && user.role !== 'Faculty') {
      return { redirect: '/unauthorized' };
    }

    // 3. Student route protection
    if (pathname.startsWith('/student') && user.role !== 'Student') {
      return { redirect: '/unauthorized' };
    }
  }

  return null;
}

export const config = {
  matcher: ['/admin/:path*', '/faculty/:path*', '/student/:path*'],
};

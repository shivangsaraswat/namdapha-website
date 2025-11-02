import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith('/auth/')) {
          return true;
        }
        
        // Require token for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (all API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth pages)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
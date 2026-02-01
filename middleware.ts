import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth/signin (login page)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images if any)
     * - products (public product images)
     * - photos (public product photos)
     * - category (public category pages)
     * - product (public product pages)
     * - $ (homepage - exact match needs handling, usually implicitly handled if not matched by regex, but regex matches "everything except...", so homepage "/" matches "everything" unless excluded)
     */
    "/((?!auth/signin|api|_next/static|_next/image|favicon.ico|images|products|photos|category|product|$).*)",
  ],
};

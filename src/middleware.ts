import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = request.cookies.has("auth_token"); // Example auth check

    // Protect all routes except auth pages
    if (!isAuthenticated && !pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Redirect logged-in users from auth pages to home
    if (isAuthenticated && pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};

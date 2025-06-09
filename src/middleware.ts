import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const isProtectedRoute = ["/dashboard", "/projects", "/notifications", "/profileSettings"].some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  const isRootRoute = req.nextUrl.pathname === "/";

  if (token) {
    try {
      const [, payload] = token.split(".");
      const decoded = JSON.parse(atob(payload));
      const exp = decoded.exp * 1000;

      // If token expired, delete the cookie and redirect to "/"
      if (Date.now() > exp) {
        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.set("access_token", "", { path: "/", maxAge: -1 }); // Remove the cookie
        return response;
      }

      // If user is on root and token is valid, redirect to "/dashboard"
      if (isRootRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next(); // Token is valid, allow access to protected routes

    } catch (err) {
      console.error("Invalid token:", err);
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.set("access_token", "", { path: "/", maxAge: -1 }); // Remove the cookie on invalid token
      return response;
    }
  } else {
    // If there's no token, deny access to protected routes and redirect to "/"
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next(); // Allow access if no token and on the root route
  }
}

export const config = {
  matcher: ["/", "/dashboard", "/projects", "/notifications", "/profileSettings"],
};

// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();

//   const supabase = createMiddlewareClient({ req, res });

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   console.log("Middleware running");
//   console.log("session: ", session);
//   if (!session) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
//   return res;
// }

// export const config = {
//   matcher: ["/dashboard", "/projects", "/notifications", "/profileSettings"],
// };
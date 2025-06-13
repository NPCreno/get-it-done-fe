import { NextRequest, NextResponse } from "next/server";
import { base64UrlDecode } from "./app/utils/utils";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const isProtectedRoute = [
    "/dashboard",
    "/projects",
    "/notifications",
    "/profileSettings",
  ].some((path) => req.nextUrl.pathname.startsWith(path));

  const isRootRoute = req.nextUrl.pathname === "/";

  if (token) {
    try {
      const [, payload] = token.split(".");
      const decoded = JSON.parse(base64UrlDecode(payload));
      const exp = decoded.exp * 1000;

      console.log("Token exp:", new Date(exp).toISOString());
      console.log("Now:", new Date().toISOString());

      if (Date.now() > exp) {
        console.warn("Deleting access_token: Token expired");
        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.set("access_token", "", { path: "/", maxAge: -1 });
        return response;
      }

      if (isRootRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.error("Deleting access_token: Token decode error", err);
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.set("access_token", "", { path: "/", maxAge: -1 });
      return response;
    }
  } else {
    if (isProtectedRoute) {
      console.warn("Deleting access_token: Missing token on protected route");
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }
}

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

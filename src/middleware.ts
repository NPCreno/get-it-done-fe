import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // const res = NextResponse.next();

  // ✅ Simulate session (hardcoded for development)
  // const session = {
  //   user: {
  //     id: "mock-user-id",
  //     email: "dev@example.com",
  //   },
  //   access_token: "mock-access-token",
  // };

  // 🚫 If you want to simulate an unauthenticated user, set `session = null`
  // if (!session) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // Optionally attach user info to request headers (if needed by downstream API routes or pages)
  // res.headers.set("x-user-id", session.user.id);

  // return res;
}

export const config = {
  matcher: ["/dashboard", "/projects", "/notifications", "/profileSettings"],
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
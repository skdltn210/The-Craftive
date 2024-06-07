import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/cart")) {
    const session = await getToken({ req: request });
    if (session == null) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/mypage")) {
    const session = await getToken({ req: request });
    if (session == null) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/checkout")) {
    const session = await getToken({ req: request });
    if (session == null) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

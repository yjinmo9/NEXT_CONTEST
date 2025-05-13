import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type DecodedUser = {
  sub: string;
  email?: string;
  exp?: number;
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("sb-"))?.split("=")[1];

  let session: DecodedUser | null = null;

  try {
    if (token?.startsWith("base64-")) {
      const jwt = atob(token.replace("base64-", ""));
      session = jwtDecode(jwt);
    }
  } catch (error) {
    console.warn("❌ JWT 디코딩 실패:", error);
  }

  console.log("🧠 세션:", session);

  // 세션이 있다면 사용자 ID와 이메일을 헤더에 추가
  if (session?.sub) {
    response.headers.set("x-user-id", session.sub);
    if (session.email) {
      response.headers.set("x-user-email", session.email);
    }
  }

  const protectedPaths = ["/home", "/report", "/news", "/my"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !session) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/home/:path*",
    "/report/:path*",
    "/news/:path*",
    "/my/:path*",
  ],
};

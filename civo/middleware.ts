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
      const raw = token.replace("base64-", "");
      const decoded = atob(raw);
      //console.log("📦 base64 디코딩 결과:", decoded);
  
      const parsed = JSON.parse(decoded);
      const jwt = parsed.access_token;
  
      if (jwt && jwt.split(".").length === 3) {
        session = jwtDecode(jwt);
        //console.log("✅ JWT 디코딩 성공:", session);
      } else {
        //console.warn("⚠️ access_token이 유효한 JWT 형식이 아님:", jwt);
      }
    } else {
      //console.warn("⚠️ base64- 접두사가 없는 토큰이거나 없음:", token);
    }
  } catch (error) {
    //console.warn("❌ JWT 디코딩 실패:", error);
  }
  

  //console.log("🧠 세션:", session);

  // 세션 정보 있으면 response 헤더에 담기
  if (session?.sub) {
    response.headers.set("x-user-id", session.sub);
    if (session.email) {
      response.headers.set("x-user-email", session.email);
    }
  }

  // 보호된 경로인지 확인
  const protectedPaths = ["/home", "/report", "/news", "/my"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 보호된 경로인데 세션 없으면 로그인으로 리디렉션
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

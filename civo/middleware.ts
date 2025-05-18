// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

/* ───────── 유틸 ───────── */

/* -------- 1. 쿠키 => base64 -------- */
function getSupabaseBase64(header = ""): string | null {
  const cookies = header.split(/;\s*/);

  /* ① split JWT(.0 / .1 / .2) */
  const frags = cookies
    .filter((c) => c.includes("auth-token."))
    .map((c) => c.split("="))
    .sort(
      (a, b) =>
        Number(a[0].match(/\.([0-9]+)$/)?.[1] ?? 0) -
        Number(b[0].match(/\.([0-9]+)$/)?.[1] ?? 0),
    )
    .map(([, v]) => decodeURIComponent(v));

  if (frags.length) {
    let joined = frags.join("");
    if (joined.startsWith("base64-")) joined = joined.slice(7);
    return joined; // ← 순수 base64
  }

  /* ② access-token (base64-JSON) */
  const access = cookies
    .find((c) => c.includes("access-token="))
    ?.split("=")[1];
  if (access) return decodeURIComponent(access.replace(/^base64-/, ""));

  /* ③ 단일 auth-token (base64-JSON) */
  const single = cookies
    .find(
      (c) =>
        c.startsWith("sb-") &&
        c.includes("auth-token=") &&          // 이름에 .0/.1 없음
        !c.includes("auth-token.")            // 점 없는 단일 쿠키
    )
    ?.split("=")[1];
  if (single) return decodeURIComponent(single.replace(/^base64-/, ""));

  return null;
}

function fixUrlSafeBase64(b64: string) {
  // 1) URL-safe 문자 원위치
  let fixed = b64.replace(/-/g, "+").replace(/_/g, "/");

  // 2) 패딩 보충
  const pad = fixed.length % 4;
  if (pad) fixed += "=".repeat(4 - pad);

  return fixed;
}

type JwtSession = { sub?: string; email?: string; exp?: number };
/* -------- 2. base64 → JWT 세션 -------- */
function decodeJwtFromBase64(b64: string | null) {
  if (!b64) return null;

  try {
    const json   = atob(fixUrlSafeBase64(b64));   // ← 수정
    const parsed = JSON.parse(json);

    if (typeof parsed.access_token === "string")
      return jwtDecode(parsed.access_token);

  } catch (err) {
    console.error("❌ decodeJwtFromBase64 error:", err, "\nraw:", b64.slice(0,60));
  }
  return null;
}

/* ───────── 미들웨어 ───────── */

const PROTECTED = ["/home", "/report", "/news", "/my"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  /* 1) 쿠키 헤더 → Base64 추출 */
  const rawB64 = getSupabaseBase64(req.headers.get("cookie") ?? "");

  /* 2) 세션 디코드 */
  let session: JwtSession | null = null;
  if (rawB64) session = decodeJwtFromBase64(rawB64);

  /* 3) 세션 있으면 헤더 주입 */
  if (session?.sub) {
    res.headers.set("x-user-id", session.sub);
    if (session.email) res.headers.set("x-user-email", session.email);
  }

  /* 4) 보호 경로 && 세션 없으면 로그인으로 */
  const needAuth = PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p));
  if (needAuth && !session) {
    const login = new URL("/sign-in", req.url);
    login.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return res;
}

/* ───────── 매처 ───────── */
export const config = {
  matcher: [
    // 정적 파일 제외용 정규식
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpe?g|gif|webp)$).*)',

    // 보호 경로: 값 ‘그대로’ 나열
    '/home/:path*',
    '/report/:path*',
    '/news/:path*',
    '/my/:path*',
  ],
};


import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const supabase = await supabaseServer();
  const url      = new URL(req.url);
  const code     = url.searchParams.get("code");

  if (!code)
    return NextResponse.redirect(new URL("/sign-in?type=error&message=NO_CODE", req.url));

  // 1) code → 세션 (쿠키에 sb-...auth-token.* 저장)
  const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
  if (exErr)
    return NextResponse.redirect(
      new URL(`/sign-in?type=error&message=${encodeURIComponent(exErr.message)}`, req.url)
    );

  // 2) 유저 정보
  const { data, error: userErr } = await supabase.auth.getUser();
  const user = data?.user;
  if (userErr || !user)
    return NextResponse.redirect(new URL("/sign-in?type=error&message=NO_USER", req.url));

  // 3) users 테이블에 최초 1회만 INSERT (id PK = auth.users.id)
  const meta = user.user_metadata ?? {};
  const { error: insErr } = await supabase
    .from("users")
    .upsert(
      {
        id   : user.id,
        email: user.email,
        name : meta.nickname ?? meta.name ?? null,
      },
      { onConflict: "id", ignoreDuplicates: true }  // v2 insert 옵션
    );

  if (insErr)
    return NextResponse.redirect(new URL("/sign-in?type=error&message=INSERT_FAIL", req.url));

  // 4) 성공 → /home
  return NextResponse.redirect(new URL("/home", req.url));
}

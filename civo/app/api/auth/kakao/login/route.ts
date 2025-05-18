import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const supabase = await supabaseServer();

  const origin = new URL(req.url).origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options : { redirectTo: `${origin}/api/auth/callback` },
  });

  if (error) throw error;          // 필요시 500 JSON 반환

  // Supabase가 code_verifier 쿠키를 set() 해놓았으므로
  // 이 Response 에 Set-Cookie 헤더가 포함된다
  return NextResponse.redirect(data.url);
}

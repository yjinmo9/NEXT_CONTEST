import { createClient } from "@/utils/supabase/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { useEffect } from "react";
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    console.log("userId", userId);

    const { data: pending } = await supabase
      .from("pending_users")
      .select("*")
      .eq("id", userId)
      .single();

    if (pending) {
      await supabase.from("users").insert({
        id: userId,
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        created_at: new Date(),
      });

      // ✅ 임시 레코드 삭제
      await supabase.from("pending_users").delete().eq("id", userId);
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}

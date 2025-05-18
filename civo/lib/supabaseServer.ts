import { cookies as nextCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** 요청 당 한 번 호출해서 Supabase 클라이언트 반환 */
export const supabaseServer = async () => {
  // 1) 헤더 쿠키 읽기 (await 필수)
  const cookieStore = await nextCookies();

  // 2) createServerClient → 쿠키 읽기·쓰기 메서드 직접 구현
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 읽기
        get: (name: string) => cookieStore.get(name)?.value,
        // 쓰기 (Server Action/Route Handler에서만 필요)
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        // 삭제
        remove: (name) => {
          cookieStore.delete(name);
        },
      },
    }
  );
};

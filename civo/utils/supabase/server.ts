import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = cookies(); // get cookie context

  const url = "https://fionhhnbcfygydxzuoqw.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb25oaG5iY2Z5Z3lkeHp1b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNTM3MTksImV4cCI6MjA1ODcyOTcxOX0.Vjx8nadNRDxph8YaNFtgbmcvoVk-UP6ymqouEKBuyuA";

  // 환경변수가 설정되지 않았을 경우 에러 발생
  if (!url || !key) {
    throw new Error("Supabase URL이나 Key가 설정되지 않았습니다.");
  }

  // Supabase 클라이언트 생성
  return createServerClient(url, key, {
    cookies: {
      async getAll() {
        return (await cookieStore).getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(async ({ name, value, options }) => {
            (await cookieStore).set(name, value, options);
          });
        } catch (error) {
          // Server Component에서는 무시 가능
        }
      },
    },
  });
};


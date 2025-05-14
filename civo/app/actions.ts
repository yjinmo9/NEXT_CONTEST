"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAndStoreNews, formatRelativeTimeKST } from "@/lib/newsCrawler";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const createClient = async () => {
  const cookieStore = await cookies(); // ✅ 동기 함수
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (all) => {
          all.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              secure: true, // ✅ HTTPS 환경에서는 반드시 필요
            });
          });
        },
      },
    }
  );
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const phone = formData.get("phone")?.toString();
  const name = formData.get("name")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect("error", "/sign-up", "이메일과 비밀번호를 입력해주세요.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.user) {
    return encodedRedirect("error", "/sign-up", error?.message || "회원가입 실패");
  }

  // ⭐ pending_users 테이블에 insert
  const { error: insertError } = await supabase.from("pending_users").insert([
    {
      id: data.user.id, // auth.users 테이블의 id
      name: name,
      email: email,
      phone: phone,
    },
  ]);

  if (insertError) {
    return encodedRedirect("error", "/sign-up", `회원가입은 되었지만 사용자 정보 저장 실패: ${insertError.message}`);
  }

  return encodedRedirect(
    "success",
    "/sign-in",
    "가입이 완료되었습니다. 이메일을 확인해주세요."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return encodedRedirect("error", "/sign-in", "이메일과 비밀번호를 입력해주세요.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/home");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "이메일을 입력해주세요.");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    return encodedRedirect("error", "/forgot-password", error.message);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "비밀번호 재설정 링크가 이메일로 전송되었습니다."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return encodedRedirect("error", "/protected/reset-password", "비밀번호를 모두 입력해주세요.");
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/protected/reset-password", "비밀번호가 일치하지 않습니다.");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return encodedRedirect("error", "/protected/reset-password", error.message);
  }

  return encodedRedirect("success", "/protected/reset-password", "비밀번호가 변경되었습니다.");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export const postAction = async (formData: FormData): Promise<void> => {
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const type = formData.get("type")?.toString() || "incident";
  let category = formData.get("category")?.toString() || "incident";

  // ✅ type이 "missing"이면 category도 자동 설정
  if (type === "missing") {
    category = "missing";
  }
  const user_id = (await headers()).get("x-user-id");

  const mediaUrls = formData.getAll("media_urls").map((url) => url.toString());

  const userLat = parseFloat(formData.get("user_lat") as string);
  const userLng = parseFloat(formData.get("user_lng") as string);
  const reportLat = parseFloat(formData.get("report_lat") as string);
  const reportLng = parseFloat(formData.get("report_lng") as string);

  const missingName = formData.get("missing_name")?.toString() || null;
  const missingAge = parseInt(formData.get("missing_age") as string) || null;
  const missingGender = formData.get("missing_gender")?.toString() || null;

  // ✅ 거리 계산 함수
  const getDistanceInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371000; // 미터 단위 지구 반지름
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance_m = getDistanceInMeters(userLat, userLng, reportLat, reportLng);
  console.log("✅ distance_m 계산됨:", distance_m);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reports")
    .insert([{
      title,
      content,
      user_id,
      type,
      category,
      media_urls: mediaUrls,
      user_lat: userLat,
      user_lng: userLng,
      report_lat: reportLat,
      report_lng: reportLng,
      distance_m,
      status: "pending",
      missing_name: missingName,
      missing_age: missingAge,
      missing_gender: missingGender,

      // ✅ 추가!
      missing_lat: parseFloat(formData.get("missing_lat") as string) || null,
      missing_lng: parseFloat(formData.get("missing_lng") as string) || null,

    }]);

  if (error) {
    console.error("❌ 데이터 삽입 오류:", error.message);
    throw new Error(error.message);
  }

  console.log("✅ 제보 저장 완료:", data);
  redirect("/report/done");
};


export const getNewListAction = async () => {
  await fetchAndStoreNews(); // 새로운 뉴스 데이터 가져와서 저장

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('뉴스 조회 에러:', error);
    return [];
  }

  return data.map(item => ({
    ...item,
    created_at: formatRelativeTimeKST(item.created_at)

  }));
};


// 🔁 교체용: 실제 Supabase에서 reports 테이블에서 데이터 fetch + distance_m 포함
export const getMyReportsAction = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('📛 제보 조회 에러:', error.message);
    return [];
  }

  return data.map((item) => ({
    ...item,
    created_at: formatRelativeTimeKST(item.created_at),
    distance_m: item.distance_m ?? null, // 👈 여기!
  }));
}



export const getReportsForMap = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('📛 [getReportsForMap] 제보 조회 에러:', error.message);
    return [];
  }

  // 🔍 전체 개수 로그
  console.log('📦 전체 제보 개수:', data.length);

  // 🔍 필터링 조건 적용
  const filtered = data.filter((item) => {
    const isMissing = item.type === 'missing';
    const isNearby = item.distance_m !== null && item.distance_m <= 100;
    const shouldRender = isMissing || isNearby;

    // 🔍 필터링 개별 로그
    console.log(`🧭 타입: ${item.type}, 거리: ${item.distance_m} → ${shouldRender ? '✅ 표시' : '❌ 제외'}`);

    return shouldRender;
  });

  console.log('✅ 렌더링 대상 제보 개수:', filtered.length);

  return filtered;
};

export const getUserIdAction = async () => {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("x-user-id");
  if (!userId) {  
    console.error("❌ 사용자 ID가 없습니다.");
    return null;
  } 
  console.log("✅ 사용자 ID:", userId);
  return userId;
};
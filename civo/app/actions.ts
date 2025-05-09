"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAndStoreNews,formatRelativeTimeKST } from "@/lib/newsCrawler";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const postAction = async (formData: FormData): Promise<void> => {
  console.log('NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS);
  
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const type = formData.get("type")?.toString() || 'incident'; // type 필드 추가
  const mediaUrls = formData.getAll("media_urls").map(url => url.toString());
  const userLat = parseFloat(formData.get("user_lat") as string);
  const userLng = parseFloat(formData.get("user_lng") as string);
  const reportLat = parseFloat(formData.get("report_lat") as string);
  const reportLng = parseFloat(formData.get("report_lng") as string);

  // missing 관련 필드 추가
  const missingName = formData.get("missing_name")?.toString();
  const missingAge = parseInt(formData.get("missing_age") as string);
  const missingGender = formData.get("missing_gender")?.toString();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reports")
    .insert([{
      title,
      content,
      type, // type 필드 추가
      media_urls: mediaUrls,
      user_lat: userLat,
      user_lng: userLng,
      report_lat: reportLat,
      report_lng: reportLng,
      status: 'pending',
      // missing 관련 필드 추가
      missing_name: missingName,
      missing_age: missingAge,
      missing_gender: missingGender
    }]);

  if (error) {
    console.error("데이터 삽입 오류:", error.message);
    throw new Error(error.message);
  }

  console.log("Report created successfully:", data);
  redirect('/report/done');
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


export const getMyReportsAction = async () => {
  const dummyReports = [
    {
      id: 1,
      title: "전장연, 혜화역 승강장 시위하다 강제퇴거... 서울 연속",
      created_at: "2025.04.26",
      image: null,
      status: 'pending' as const
    },
    {
      id: 2,
      title: "전장연, 혜화역 승강장 시위하다 강제퇴거... 서울 연속",
      created_at: "2025.04.26",
      image: null,
      status: 'completed' as const
    },
    {
      id: 3,
      title: "전장연, 혜화역 승강장 시위하다 강제퇴거... 서울 연속",
      created_at: "2025.04.26",
      image: null,
      status: 'pending' as const
    }
  ];
};


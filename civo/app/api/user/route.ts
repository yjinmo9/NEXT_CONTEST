import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", uid)
    .maybeSingle();

  if (error) {
    console.error("유저 조회 에러:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("유저 조회 결과:", data);

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  const body = await req.json(); // 🔹 요청 바디에서 name 등 추출
  const { name, email, phone, profile_image} = body;

  const { data, error } = await supabase
    .from("users")
    .update({
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(profile_image !== undefined && { profile_image }),
    })
    .eq("id", uid)
    .select()
    .maybeSingle(); // 🔹 업데이트 후 결과 반환

  if (error) {
    console.error("❌ 사용자 정보 수정 실패:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("✅ 수정된 사용자 정보:", data);
  return NextResponse.json(data); // 또는 NextResponse.json(null, { status: 204 });
}
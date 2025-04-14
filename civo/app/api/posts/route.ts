import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts") // 🔸 posts 테이블에서
    .select("*")   // 🔸 모든 컬럼을 선택
    .order("created_at", { ascending: false }); // 🔸 최신순 정렬

  if (error) {
    console.error("데이터 조회 오류:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
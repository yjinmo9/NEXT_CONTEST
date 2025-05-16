// app/api/home/update-views/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { reportId } = await req.json();

  if (!reportId) {
    return NextResponse.json({ error: "reportId is required" }, { status: 400 });
  }

  // 1️⃣ 현재 조회수 가져오기
  const { data: currentData, error: fetchError } = await supabase
    .from("reports")
    .select("views")
    .eq("id", reportId)
    .maybeSingle();

  if (fetchError || !currentData) {
    return NextResponse.json({ error: "조회수 불러오기 실패" }, { status: 500 });
  }

  const newViews = (currentData.views || 0) + 1;

  // 2️⃣ 조회수 증가
  const { data, error } = await supabase
    .from("reports")
    .update({ views: newViews })
    .eq("id", reportId)
    .select("views")
    .maybeSingle();

  if (error) {
    console.error("❌ 조회수 업데이트 실패:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ views: data?.views });
}

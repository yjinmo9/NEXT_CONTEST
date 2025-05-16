// app/api/home/update-views/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { reportId } = await req.json();

  if (!reportId) {
    return NextResponse.json({ error: "reportId is required" }, { status: 400 });
  }

  // 조회수 증가
  const { data, error } = await supabase
    .from("reports") // ⚠️ 테이블 이름 정확히!
    .update({ views: (prev: any) => prev.views + 1 })
    .eq("id", reportId)
    .select("views")
    .single();

  if (error) {
    console.error("❌ 조회수 업데이트 실패:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ views: data.views });
}

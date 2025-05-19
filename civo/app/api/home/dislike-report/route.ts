// app/api/home/dislike-report/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { reportId } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = user.id;

  // 이미 비추천한 적 있는지 확인
  const { data: existing } = await supabase
    .from("report_dislikes")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Already disliked" }, { status: 400 });
  }

  // 1. record 저장
  const { error: insertError } = await supabase
    .from("report_dislikes")
    .insert({ report_id: reportId, user_id: userId });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // 2. reports 테이블에서 dislikes + 1
  // 1. 기존 수치 조회
  const { data: current, error: fetchError } = await supabase
    .from("reports")
    .select("dislikes")
    .eq("id", reportId)
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: fetchError?.message || "Not found" }, { status: 500 });
  }

  // 2. +1 해서 업데이트
  const { data, error: updateError } = await supabase
    .from("reports")
    .update({ likes: current.dislikes + 1 })
    .eq("id", reportId)
    .select("dislikes")
    .single();


  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ dislikes: data.dislikes });
}

// app/api/home/like-report/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { reportId } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = user.id;

  // 이미 추천한 적 있는지 확인
  const { data: existing } = await supabase
    .from("report_likes")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Already liked" }, { status: 400 });
  }

  // 트랜잭션으로 처리 (1. likes 추가, 2. record 저장)
  const { error: insertError } = await supabase
    .from("report_likes")
    .insert({ report_id: reportId, user_id: userId });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // 1. 기존 수치 조회
  const { data: current, error: fetchError } = await supabase
    .from("reports")
    .select("likes")
    .eq("id", reportId)
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: fetchError?.message || "Not found" }, { status: 500 });
  }

  // 2. +1 해서 업데이트
  const { data, error: updateError } = await supabase
    .from("reports")
    .update({ likes: current.likes + 1 })
    .eq("id", reportId)
    .select("likes")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ likes: data.likes });
}

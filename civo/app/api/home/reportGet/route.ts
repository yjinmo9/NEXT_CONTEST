import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/home/[id]?id=...
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id 파라미터가 필요합니다." }, { status: 400 });
  }

  console.log("📥 요청받은 report ID:", id);

  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ 신고글 조회 실패:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!report) {
    console.warn("⚠️ 해당 ID의 신고글이 존재하지 않습니다.");
    return NextResponse.json({ error: "신고글을 찾을 수 없습니다." }, { status: 404 });
  }

  // 🔍 필터링 조건
  const isMissing = report.type === "missing";
  const isNearby = report.distance_m !== null && report.distance_m <= 100;

  if (!(isMissing || isNearby)) {
    console.warn("🚫 필터 조건 불충족 → 응답 거부");
    return NextResponse.json(
      { error: "해당 신고글은 조건에 부합하지 않습니다." },
      { status: 403 }
    );
  }

  // ✅ 사용자 인증
  const { data: { user } } = await supabase.auth.getUser();

  let alreadyLiked = false;

  if (user) {
    const { data: likeData } = await supabase
      .from("report_likes")
      .select("id")
      .eq("report_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    alreadyLiked = !!likeData;
  }

  // 🟢 최종 응답
  return NextResponse.json(
    {
      ...report,
      alreadyLiked,
    },
    { status: 200 }
  );
}

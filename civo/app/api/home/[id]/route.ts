import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/home/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = await createClient();
  const {id} = context.params;

  console.log("📥 요청받은 report ID:", id);

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ 신고글 조회 실패:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    console.warn("⚠️ 해당 ID의 신고글이 존재하지 않습니다.");
    return NextResponse.json({ error: "신고글을 찾을 수 없습니다." }, { status: 404 });
  }

  console.log("📦 조회된 원본 데이터:", data);

  // 🔍 필터링 조건 로그 출력
  const isMissing = data.type === "missing";
  const isNearby = data.distance_m !== null && data.distance_m <= 100;

  console.log("🔍 필터링 조건 결과:", {
    type: data.type,
    distance_m: data.distance_m,
    isMissing,
    isNearby,
  });

  if (!(isMissing || isNearby)) {
    console.warn("🚫 필터 조건 불충족 → 응답 거부");
    return NextResponse.json(
      { error: "해당 신고글은 조건에 부합하지 않습니다." },
      { status: 403 }
    );
  }

  console.log("✅ 조건 통과 → 신고글 반환");

  return NextResponse.json(data, { status: 200 });
}

// app/api/home/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "";

  if (!keyword) {
    return NextResponse.json(
      { error: "검색 키워드가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .or(
        `title.ilike.%${keyword}%,content.ilike.%${keyword}%,category.ilike.%${keyword}%`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase 검색 오류:", error.message);
      return NextResponse.json(
        { error: "검색 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // ✅ 필터링 조건 적용: type이 'missing'이거나, distance_m <= 100인 것만
    const filtered = reports.filter((item) => {
      return (
        item.type === "missing" ||
        (item.distance_m !== null && item.distance_m <= 100)
      );
    });

    console.log(`🔍 키워드 '${keyword}' 검색 후 필터링 결과: ${filtered.length}건`);
    return NextResponse.json({ reports: filtered });
  } catch (e) {
    console.error("❌ 예외 발생:", e);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
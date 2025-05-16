// app/api/report/nearby-reports/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  let radius = parseInt(searchParams.get("radius") || "100", 10);
  const length = parseInt(searchParams.get("length") || "0", 10);

  console.log("📥 요청받은 위도/경도:", { lat, lng });

  if (!lat || !lng) {
    return NextResponse.json({ error: "위도/경도 누락" }, { status: 400 });
  }

  console.log(`📍 클릭된 위치: lat=${lat}, lng=${lng}`);

  const step = 1000;
  const maxRadius = 30000;
  let found = [];

  while (radius <= maxRadius) {
    console.log(`🔍 반경 ${radius}m로 검색 시도 중...`);
  
    const { data, error } = await supabase.rpc("get_reports_within_radius", {
      lat_input: lat,
      lng_input: lng,
      radius_m: radius,
    });
  
    if (error) {
      console.error("🚨 RPC 오류:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`📦 반경 ${radius}m 내 데이터 개수: ${data.length}`);

    if (data.length >= length+3) {
      console.log(`✅ 목표 충족: ${data.length}개 확보, 반경 ${radius}m에서 멈춤`);
      found = data;
      break;
    }

    found = data;
    radius += step;
    console.log(`↗️ 반경 증가: 다음 검색 반경은 ${radius}m`);
  }

  // ✅ id만 추출
  const result = found
    .sort((a: { distance_m: number }, b: { distance_m: number }) => a.distance_m - b.distance_m)
    .map((item: any) => item.id);
  
  const res = {
    data: {
      radius: radius,
      result: result,
      length: result.length,
    }
  }

  console.log("✅ 최종 반환 ID 리스트:", result);

  return NextResponse.json(res); // ✅ 리스트 형태로 반환
}

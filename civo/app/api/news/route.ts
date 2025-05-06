import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ✅ 사용자와 제보 위치 사이의 거리 계산 함수 (Haversine 공식)
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // 지구 반지름(m)
  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  const supabase = await createClient();

  // ✅ 쿼리 파라미터에서 사용자 위치 받기
  const { searchParams } = new URL(request.url);
  const userLat = parseFloat(searchParams.get("lat") || "");
  const userLng = parseFloat(searchParams.get("lng") || "");

  if (isNaN(userLat) || isNaN(userLng)) {
    return NextResponse.json({ error: "사용자 위치 누락" }, { status: 400 });
  }

  // ✅ 조건에 맞는 report만 가져오기
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .in("type", ["incident", "damage", "missing"])
    .lte("distance_m", 500); // 500m 이내

  if (error) {
    console.error("제보 조회 오류:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ✅ 거리 기준으로 정렬하고 필요한 필드만 가공
  const result = reports
    .map((report) => {
      const client_distance = getDistanceInMeters(userLat, userLng, report.report_lat, report.report_lng);
      return {
        id: report.id,
        type: report.type,
        title: report.title,
        content: report.content,
        created_at: report.created_at,
        image_url: report.media_urls?.[0] || null,
        distance_m: client_distance
      };
    })
    .sort((a, b) => a.distance_m - b.distance_m); // 가까운 순

  return NextResponse.json(result, { status: 200 });
}

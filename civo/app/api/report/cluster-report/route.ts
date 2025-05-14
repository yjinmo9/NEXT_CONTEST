import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");

  const supabase = await createClient();
  const delta = 0.0015; // ±약 150m 범위 (조정 가능)

  const { data, error } = await supabase
    .from("reports")
    .select("id, report_lat, report_lng, content, created_at, user_id, media_urls")
    .order("created_at", { ascending: false })
    .limit(1)
    .filter("report_lat", "gte", lat - delta)
    .filter("report_lat", "lte", lat + delta)
    .filter("report_lng", "gte", lng - delta)
    .filter("report_lng", "lte", lng + delta);

  if (error) {
    console.error("❌ Supabase 에러:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    console.warn("⚠️ 주변 제보 없음:", { lat, lng });
    return NextResponse.json({ error: "제보 없음" }, { status: 404 });
  }

  const r = data[0];

  return NextResponse.json({
    id: r.id,
    report_lat: r.report_lat,
    report_lng: r.report_lng,
    content: r.content,
    created_at: r.created_at,
    user_id: r.user_id ?? "익명",
    media_url: r.media_urls?.[0] ?? "/placeholder.png",
  });
}


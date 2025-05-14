import { createClient } from "@/utils/supabase/server";
import { data as autoprefixerData } from "autoprefixer";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");

  const supabase = await createClient();
  const delta = 0.0015;

// 1️⃣ incident / damage → report_lat/lng 기준
const { data: reportData, error: reportError } = await supabase
  .from("reports")
  .select("id, report_lat, report_lng, content, created_at, user_id, media_urls, type")
  .in("type", ["incident", "damage"])
  .filter("report_lat", "gte", lat - delta)
  .filter("report_lat", "lte", lat + delta)
  .filter("report_lng", "gte", lng - delta)
  .filter("report_lng", "lte", lng + delta);

// 2️⃣ missing → missing_lat/lng 기준
const { data: missingData, error: missingError } = await supabase
  .from("reports")
  .select("id, missing_lat, missing_lng, content, created_at, user_id, media_urls, type")
  .eq("type", "missing")
  .filter("missing_lat", "gte", lat - delta)
  .filter("missing_lat", "lte", lat + delta)
  .filter("missing_lng", "gte", lng - delta)
  .filter("missing_lng", "lte", lng + delta);

// 3️⃣ 두 결과 합치기
const allData = [...(reportData ?? []), ...(missingData ?? [])];


  if (reportError || missingError) {
    const supabaseError = reportError || missingError;
    console.error("❌ Supabase 에러:", supabaseError?.message || "Unknown error");
    return NextResponse.json({ error: supabaseError?.message || "Unknown error" }, { status: 500 });
  }

  if (!allData || allData.length === 0) {
    console.warn("⚠️ 주변 제보 없음:", { lat, lng });
    return NextResponse.json({ error: "제보 없음" }, { status: 404 });
  }

  const r = allData[0];

  const isReportType = (data: typeof r): data is { id: any; report_lat: any; report_lng: any; content: any; created_at: any; user_id: any; media_urls: any; type: any } =>
    "report_lat" in data && "report_lng" in data;

  return NextResponse.json({
    id: r.id,
    report_lat: isReportType(r) ? r.report_lat : r.missing_lat,
    report_lng: isReportType(r) ? r.report_lng : r.missing_lng,
    content: r.content,
    created_at: r.created_at,
    user_id: r.user_id ?? "익명",
    media_url: r.media_urls?.[0] ?? "/placeholder.png",
  });
}


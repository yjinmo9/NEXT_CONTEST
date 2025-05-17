import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

function getEpsByZoom(zoom: number): number {
  if (zoom >= 19) return 1 / 6371000; // 35m
  if (zoom >= 18) return 80000 / 6371000;
  if (zoom >= 17) return 400000 / 6371000;
  if (zoom >= 16) return 800000 / 6371000;
  if (zoom >= 15) return 1000000 / 6371000;
  if (zoom >= 13) return 5000000 / 6371000;
  if (zoom >= 11) return 6000000 / 6371000;
  if (zoom >= 9) return 70000000 / 6371000;
  return 100000000 / 6371000;
}

function haversineDistance(a: number[], b: number[]) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const aVal =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(aVal));
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const zoom = parseInt(searchParams.get('zoom') || '15', 10);

  const { data, error } = await supabase
    .from('reports')
    .select('id, type, report_lat, report_lng, missing_lat, missing_lng, distance_m, media_urls, content, user_id, created_at');

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }

  const filtered = data
    .filter((item) => {
      if (item.type === 'missing') return item.missing_lat && item.missing_lng;
      if (['incident', 'damage'].includes(item.type) && item.distance_m <= 100) return item.report_lat && item.report_lng;
      return false;
    })
    .map((item) => ({
      id: item.id,
      type: item.type, // ✅ type을 포함시켜야 함
      lat: item.type === 'missing' ? item.missing_lat : item.report_lat,
      lng: item.type === 'missing' ? item.missing_lng : item.report_lng,
      media_url: item.media_urls?.[0] ?? "/placeholder.png",
      user_id: item.user_id ?? "익명",
      content: item.content ?? "설명 없음",
      created_at: item.created_at ?? "날짜 없음",
    }));

  const eps = getEpsByZoom(zoom);
  const coords = filtered.map((p) => [p.lat, p.lng]);

  const dbscan = require('density-clustering').DBSCAN;
  const clustering = new dbscan();
  const clustersRaw = clustering.run(coords, eps, 2, haversineDistance);
  const clusteredIndexes = new Set(clustersRaw.flat());

  const result = clustersRaw.map((cluster: number[], i: any) => {
    const clusterPoints = cluster.map((idx: number) => filtered[idx]);

    const centerLat = clusterPoints.reduce((sum: any, p: { lat: any; }) => sum + p.lat, 0) / clusterPoints.length;
    const centerLng = clusterPoints.reduce((sum: any, p: { lng: any; }) => sum + p.lng, 0) / clusterPoints.length;

    const representative = clusterPoints[0];

    return {
      cluster_id: i,
      count: clusterPoints.length,
      center: { lat: centerLat, lng: centerLng },
      thumbnail: representative.media_url,
      report: {
        id: representative.id,
        user_id: representative.user_id,
        content: representative.content,
        created_at: representative.created_at,
        type: representative.type, // ✅ 여기를 추가
      }
    };
  });

  // 단일 포인트(노이즈)도 클러스터처럼 추가
  filtered.forEach((point, idx) => {
    if (!clusteredIndexes.has(idx)) {
      result.push({
        cluster_id: result.length,
        count: 1,
        center: { lat: point.lat, lng: point.lng },
        thumbnail: point.media_url,
        report: {
          id: point.id,
          user_id: point.user_id,
          content: point.content,
          created_at: point.created_at,
          type: point.type   // ✅ 여기도!
        }
      });
    }
  });

  return NextResponse.json(result);
}

import { createClient } from '@/utils/supabase/server';
import { dbscanClusterReports } from '@/utils/clustering';
import { NextResponse } from 'next/server';

function getEpsByZoom(zoom: number): number {
  if (zoom >= 19) return 1 / 6371000;  // 35m
  if (zoom >= 18) return 80000 / 6371000;  // 50m
  if (zoom >= 17) return 400000 / 6371000;
  if (zoom >= 16) return 800000 / 6371000;
  if (zoom >= 15) return 1000000 / 6371000;
  if (zoom >= 13) return 5000000 / 6371000;
  if (zoom >= 11) return 6000000 / 6371000;
  if (zoom >= 9) return 70000000 / 6371000;
  return 100000000 / 6371000;
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const zoom = parseInt(searchParams.get('zoom') || '15', 10);

  const { data, error } = await supabase
    .from('reports')
    .select('type, report_lat, report_lng, missing_lat, missing_lng, distance_m');

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }

  const filtered = data
    .filter((item) => {
      if (item.type === 'missing') return item.missing_lat && item.missing_lng;
      if (['incident', 'damage'].includes(item.type)) return item.distance_m <= 100;
      return false;
    })
    .map((item) => ({
      lat: item.type === 'missing' ? item.missing_lat : item.report_lat,
      lng: item.type === 'missing' ? item.missing_lng : item.report_lng,
    }));

  const eps = getEpsByZoom(zoom);

  console.log('📍 요청 중심좌표:', { lat, lng });
  console.log('🔎 줌레벨:', zoom, '| eps (radian):', eps);
  console.log('📦 필터링된 위치 개수:', filtered.length);

  // ✅ 클러스터링 실행
  const dbscan = require('density-clustering').DBSCAN;
  const clustering = new dbscan();

  const coords = filtered.map((p) => [p.lat, p.lng]);
  const clustersRaw = clustering.run(coords, eps, 2, haversineDistance);
  const clusteredIndexes = new Set(clustersRaw.flat());

  const result = clustersRaw.map((cluster: any[], i: any) => {
    const clusterPoints = cluster.map((idx: string | number) => filtered[idx as number]);
    const centerLat = clusterPoints.reduce((sum: any, p: { lat: any; }) => sum + p.lat, 0) / clusterPoints.length;
    const centerLng = clusterPoints.reduce((sum: any, p: { lng: any; }) => sum + p.lng, 0) / clusterPoints.length;

    return {
      cluster_id: i,
      count: clusterPoints.length,
      center: { lat: centerLat, lng: centerLng },
      points: clusterPoints,
    };
  });

  // ✅ 클러스터에 포함되지 않은 (노이즈) 단일 제보도 추가
  filtered.forEach((point, idx) => {
    if (!clusteredIndexes.has(idx)) {
      result.push({
        cluster_id: result.length,
        count: 1,
        center: { lat: point.lat, lng: point.lng },
        points: [point],
      });
    }
  });

  console.log('🧠 최종 클러스터 개수 (군집 + 단일 포함):', result.length);
  result.forEach((c: { cluster_id: any; count: any; center: any; }) =>
    console.log(`🧩 cluster_id: ${c.cluster_id}, count: ${c.count}, center:`, c.center)
  );

  return NextResponse.json(result);
}

// ✅ 거리 계산 (Haversine)
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

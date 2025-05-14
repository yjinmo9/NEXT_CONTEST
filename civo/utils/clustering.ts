import { DBSCAN } from 'density-clustering';

export function dbscanClusterReports(points: { lat: number; lng: number }[], eps: number) {
  const dbscan = new DBSCAN();
  const coords = points.map((p) => [p.lat, p.lng]);

  const clusters = dbscan.run(coords, eps, 2, haversineDistance);

  return clusters.map((cluster: number[], i: any) => {
    const clusterPoints = cluster.map((idx) => points[idx]);
    const centerLat = clusterPoints.reduce((sum, p) => sum + p.lat, 0) / clusterPoints.length;
    const centerLng = clusterPoints.reduce((sum, p) => sum + p.lng, 0) / clusterPoints.length;

    return {
      cluster_id: i,
      count: clusterPoints.length,
      center: { lat: centerLat, lng: centerLng },
      points: clusterPoints,
    };
  });
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

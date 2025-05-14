"use client";

import { useEffect, useState } from "react";
import Map from "./map";

export type NaverMap = naver.maps.Map;
type Lng = number;
type Lat = number;
export type Coordinates = [Lng, Lat];

type Cluster = {
  cluster_id: number;
  count: number;
  center: { lat: number; lng: number };
  points: { lat: number; lng: number }[];
};

export default function Navermap() {
  const [loc, setLoc] = useState<Coordinates | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);

  const initLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLoc([position.coords.longitude, position.coords.latitude]);
    });
  };

  useEffect(() => {
    initLocation();
  }, []);

  const handleMapReady = async (map: naver.maps.Map) => {
    const updateClusters = async () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const lat = center.y;
      const lng = center.x;

      const res = await fetch(`/api/report/cluster?lat=${lat}&lng=${lng}&zoom=${zoom}`);
      const data = await res.json();
      setClusters(data);
    };

    // 줌/이동 후 멈췄을 때 호출
    naver.maps.Event.addListener(map, "idle", updateClusters);
    updateClusters(); // 초기 1회
  };

  if (!loc) return <p className="text-sm">⏳ 위치 정보 가져오는 중...</p>;

  return (
    <div className="w-full h-full">
      <Map loc={loc} reports={clusters} onReady={handleMapReady} />
    </div>
  );
}

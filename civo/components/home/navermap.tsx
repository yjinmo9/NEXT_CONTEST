"use client";

import { useEffect, useState } from "react";
import Map from "./map";

export type NaverMap = naver.maps.Map;
type Lng = number;
type Lat = number;
export type Coordinates = [Lng, Lat];

type NavermapProps = {
  reports: any[]; // 정확한 타입이 있다면 any 대신 정의해도 좋아
};

export default function Navermap({ reports }: NavermapProps) {
  const [loc, setLoc] = useState<Coordinates | null>(null);

  const initLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLoc([position.coords.longitude, position.coords.latitude]);
    });
  };

  useEffect(() => {
    initLocation();
  }, []);

  if (!loc) return <p className="text-sm">⏳ 위치 정보 가져오는 중...</p>;

  // 디버깅 출력
  console.log("🗺️ 전달받은 reports:", reports);

  return (
    <div className="w-full h-full">
      <Map loc={loc} reports={reports} />
      <p>지도 여기에 표시됨 (제보 수: {reports.length})</p>
    </div>
  );
}
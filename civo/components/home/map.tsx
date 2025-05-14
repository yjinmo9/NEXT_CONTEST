"use client";

import Script from "next/script";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import Located from "@/src/img/located.png";
import Preview from "./Preview";

export type NaverMap = naver.maps.Map;
type Lng = number;
type Lat = number;
export type Coordinates = [Lng, Lat];

const mapId = "naver-map";
const DEFAULT_COORDINATES: Coordinates = [126.9784147, 37.5666805];

type Cluster = {
  cluster_id: number;
  count: number;
  center: { lat: number; lng: number };
  points: { lat: number; lng: number }[];
}

type Report = {
  id?: string;
  type: string;
  report_lat: number;
  report_lng: number;
  distance_m?: number | null;
  title?: string;
  category?: string;
  media_urls?: string[];
  created_at?: string;
  content?: string;
  missing_lat?: number;
  missing_lng?: number;
};

export default function Map({
  loc = DEFAULT_COORDINATES,
  onReady,
  enableRecenterButton = false,
  reports = [],
}: {
  loc?: Coordinates;
  onReady?: (map: naver.maps.Map) => void;
  enableRecenterButton?: boolean;
  reports?: Cluster[];
}) {
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // ✅ 지도 초기화
  const initializeMap = useCallback(() => {
    if (!window.naver?.maps?.LatLng || !loc) return;

    const [lng, lat] = loc;
    const mapOptions = {
      center: new window.naver.maps.LatLng(lat, lng),
      zoom: 15,
      scaleControl: true,
      mapDataControl: true,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };

    const map = new window.naver.maps.Map(mapId, mapOptions);
    mapRef.current = map;

    if (onReady) {
      onReady(map);
    }
  }, [loc, onReady]);

  // ✅ 마커 렌더링
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !Array.isArray(reports)) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    reports.forEach((cluster) => {
      const isSingle = cluster.count === 1;

      // ✅ 단일 제보는 정확한 좌표 사용
      const latlng = isSingle
        ? new naver.maps.LatLng(cluster.points[0].lat, cluster.points[0].lng)
        : new naver.maps.LatLng(cluster.center.lat, cluster.center.lng);

      const marker = new naver.maps.Marker({
        map,
        position: latlng,
        icon: isSingle
          ? undefined // ✅ 기본 마커
          : {
              content: `
                <div style="
                  background-color: #dc2626;
                  color: white;
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 12px;
                  font-weight: bold;
                  box-shadow: 0 0 6px rgba(0,0,0,0.3);
                ">
                  ${cluster.count}
                </div>
              `,
              anchor: new naver.maps.Point(16, 16),
            },
      });

      // ✅ 클릭 시 Preview 연결
      naver.maps.Event.addListener(marker, "click", () => {
        map.setZoom(isSingle ? 17 : map.getZoom());
        map.panTo(latlng);

        if (isSingle) {
          const p = cluster.points[0];
          setSelectedReport({
            id: cluster.cluster_id.toString(),
            type: "report",
            report_lat: p.lat,
            report_lng: p.lng,
            title: "단일 제보",
            category: "기타",
            content: "이 위치에 하나의 제보가 있습니다.",
          });
        } else {
          setSelectedReport({
            id: cluster.cluster_id.toString(),
            type: "cluster",
            report_lat: cluster.center.lat,
            report_lng: cluster.center.lng,
            title: `${cluster.count}건`,
            category: "군집",
            content: `${cluster.count}건의 제보가 근처에 있습니다.`,
          });
        }
      });

      markersRef.current.push(marker);

    });
  }, [reports]);

  // ✅ 현위치 이동
  const recenter = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const latlng = new naver.maps.LatLng(latitude, longitude);
      mapRef.current?.panTo(latlng);
    });
  };

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_MAP_CLIENT_ID}`}
        onReady={initializeMap}
      />
      <div id={mapId} style={{ width: "100%", height: "100%" }} />

      {enableRecenterButton && (
        <button
          type="button"
          onClick={recenter}
          className="fixed top-[20vh] right-[5vw]"
        >
          <Image src={Located} alt="현위치" width={40} height={40} />
        </button>
      )}

      {selectedReport && (
        <div className="fixed bottom-[12vh] w-full z-50 px-4 pb-4 pointer-events-none">
          <Preview report={selectedReport} />
        </div>
      )}
    </>
  );
}

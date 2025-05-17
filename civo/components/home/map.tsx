"use client";

import Script from "next/script";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import Located from "@/src/img/located.png";

type Report = {
    id?: string;
    type: string;
    report_lat: number;
    report_lng: number;
    distance_m?: number | null;
    title?: string;
    category?: string;
    media_url: string;
    created_at: string;
    content?: string;
    user_id?: string;
    views: number;
};


export type NaverMap = naver.maps.Map;
type Lng = number;
type Lat = number;
export type Coordinates = [Lng, Lat];

const mapId = "naver-map";
const DEFAULT_COORDINATES: Coordinates = [126.9784147, 37.5666805];

type Cluster = {
  [x: string]: any;
  cluster_id: number;
  count: number;
  center: { lat: number; lng: number };
  points: {
    lat: number; lng: number;
  }[];
};

export default function Map({
  loc = DEFAULT_COORDINATES,
  onReady,
  enableRecenterButton = false,
  reports = [],
  onSelectReport,
}: {
  loc?: Coordinates;
  onReady?: (map: naver.maps.Map) => void;
  enableRecenterButton?: boolean;
  reports?: Cluster[];
  onSelectReport : (report:Report) => void;
}) {
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

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
      gl: true,
      customStyleId: "3e4f5b9e-1671-4b58-a2bc-fe641fddae0a"
    };

    const map = new window.naver.maps.Map(mapId, mapOptions);
    mapRef.current = map;

    if (onReady) {
      onReady(map);
    }
  }, [loc, onReady]);

  // ✅ 마커 렌더링
  useEffect(() => {
    if (!Array.isArray(reports)) return;

    const map = mapRef.current;
    if (!map) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    reports.forEach((cluster) => {
      const isSingle = cluster.count === 1;
      const hasPoint = Array.isArray(cluster.points) && cluster.points.length > 0;


      const latlng = isSingle && hasPoint
        ? new naver.maps.LatLng(cluster.points[0].lat, cluster.points[0].lng)
        : new naver.maps.LatLng(cluster.center.lat, cluster.center.lng);

        const getMixedColor = (types: Set<string>): string => {
          const has = (t: string) => types.has(t);
          const t = { m: has("missing"), i: has("incident"), d: has("damage") };
        
          if (t.m && t.i && t.d) return "#8b5cf6";   // all 3 → 연한 보라
          if (t.m && t.i)        return "#c4b5fd";   // 빨 + 파 → 연보라
          if (t.i && t.d)        return "#84cc16";   // 파 + 노 → 민트
          if (t.m && t.d)        return "#fb923c";   // 빨 + 노 → 살구
          if (t.m)               return "#fb7185";   // 빨강 → 연 형광 레드
          if (t.i)               return "#38bdf8";   // 파랑 → 스카이블루
          if (t.d)               return "#fde047";   // 노랑 → 레몬옐로우
          return "#e5e7eb";                          // fallback → 연회색
        };
      
        const types = new Set(
          Array.isArray(cluster.points)
            ? cluster.points.map((p: any) => p.type)
            : [cluster.report?.type]
        );
        const color = getMixedColor(types);

        // 예시: cluster.count가 클수록 마커 크기도 커지게
        const count = Number(cluster.count);


        // ✅ 현재 지도 줌 레벨 가져오기
        const zoom = map.getZoom();

        // ✅ 줌 레벨 보정 팩터: 줌 15을 기준 (1.1의 거듭제곱)
        const zoomFactor = Math.pow(1.1, zoom - 15);

        // ✅ 클러스터 개수 기반 + 줌 비례한 마커 크기
        const baseSize = 32;
        const rawSize = Math.sqrt(count) * 10 + baseSize;
        const finalSize = isSingle ? baseSize : Math.min(rawSize * zoomFactor * 3, 12000);
        const innerSize = isSingle ? baseSize : finalSize * 0.5;

        // ✅ 디버깅 로그
        console.log(
          `🧠 count: ${count}, zoom: ${zoom}, zoomFactor: ${zoomFactor.toFixed(2)}, finalSize: ${finalSize.toFixed(1)}`
        );

        if (isSingle && zoom <= 11) return; // 이 마커 안 그리기
       
      
        const marker = new naver.maps.Marker({
          map,
          position: latlng,
          icon: isSingle
            ? {
                content: `
                  <div style="
                    width: ${finalSize}px;
                    height: ${finalSize}px;
                    border-radius: 50%;
                    background-color: ${color}; // ✅ 여기로 수정
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                  "></div>
                `,
                size: new naver.maps.Size(finalSize, finalSize),
                anchor: new naver.maps.Point(finalSize / 2, finalSize / 2),
              }
            : {
                content: `
                  <div style="position: relative; width: ${finalSize}px; height: ${finalSize}px;">
                    <!-- 연한 외곽 큰 원 -->
                    <div style="
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: ${finalSize}px;
                      height: ${finalSize}px;
                      border-radius: 50%;
                      background-color: ${color}33;
                    "></div>
        
                    <!-- 중심 진한 작은 원 -->
                    <div style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      width: ${innerSize}px;
                      height: ${innerSize}px;
                      border-radius: 50%;
                      background-color: ${color};
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      font-size: 14px;
                      font-weight: bold;
                      color: white;
                      box-shadow: 0 0 4px rgba(0,0,0,0.3);
                    ">
                      ${cluster.count >= 100 ? '100+' : cluster.count}
                    </div>
                  </div>
                `,
                size: new naver.maps.Size(finalSize, finalSize),
                anchor: new naver.maps.Point(finalSize / 2, finalSize / 2),
              }
        });
        
      

      naver.maps.Event.addListener(marker, "click", async () => {
        map.setZoom(isSingle ? 17 : map.getZoom());
        map.panTo(latlng);

        if (isSingle && hasPoint) {
          const p = cluster.points[0];
        } else {
          // ✅ 클러스터 중심 좌표로 대표 제보 fetch
          try {
            const res = await fetch(`/api/report/cluster-report?lat=${cluster.center.lat}&lng=${cluster.center.lng}`);
            const report = await res.json();

            // 📌 클러스터 정보 로그
            console.log("📦 report 데이터:", report);

            onSelectReport(report);

          } catch (err) {
            console.error("❌ 클러스터 대표 제보 불러오기 실패", err);
          }
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
    </>
  );
}
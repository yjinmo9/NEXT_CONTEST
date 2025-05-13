"use client";

import Script from "next/script";
import { useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Located from "@/src/img/located.png";
import Fire from "@/src/img/fire.png";
import Mass from "@/src/img/mass.png";
import CarCrash from "@/src/img/carCrash.png";
import Etc from "@/src/img/etc.png";

export type NaverMap = naver.maps.Map;
type Lng = number;
type Lat = number;
export type Coordinates = [Lng, Lat];

const mapId = "naver-map";
const DEFAULT_COORDINATES: Coordinates = [126.9784147, 37.5666805];

type Report = {
  id?: string;
  type: string;
  report_lat: number;
  report_lng: number;
  distance_m?: number | null;
  title?: string;
  category?: string;
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
  reports?: Report[];
}) {
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]); // 마커 관리

  // ✅ 지도 초기화 (최초 1회)
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

  const getIconUrl = (type: string) => {
    switch (type) {
      case "화재": return "img/fire.png";
      case "인구밀집": return "img/mass.png";
      case "교통사고": return "img/carCrash.png";
      default: return "img/etc.png";
    }
  };

  // ✅ reports가 바뀔 때마다 마커 동기화
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !Array.isArray(reports)) return;

    // 이전 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    reports.forEach((report) => {
      const show =
        report.type === "missing" ||
        (typeof report.distance_m === "number" && report.distance_m <= 100);

      const validCoords =
        report.report_lat != null &&
        report.report_lng != null &&
        !isNaN(report.report_lat) &&
        !isNaN(report.report_lng);

      console.log(
        `📍 ${report.title} 표시 조건:`,
        show,
        "좌표:",
        report.report_lat,
        report.report_lng
      );

      if (show && validCoords) {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(report.report_lat, report.report_lng),
          map,
          title: report.title || "제보",
          icon: {
            url: getIconUrl(report.category || "기타"),
            size: new naver.maps.Size(36, 36),
            scaledSize: new naver.maps.Size(36, 36),
            anchor: new naver.maps.Point(18, 18),
          }
        });

        markersRef.current.push(marker);
      }
    });
  }, [reports]);

  // ✅ 현위치로 지도 이동
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

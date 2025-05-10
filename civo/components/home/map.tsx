"use client";

import Script from "next/script";
import { useCallback, useRef } from "react";
import Image from "next/image";
import Located from "@/src/img/located.png";

export type NaverMap = naver.maps.Map;
type Lng = number;
type Lat = number;

export type Coordinates = [Lng, Lat];

const mapId = "naver-map";
const DEFAULT_COORDINATES: Coordinates = [126.9784147, 37.5666805];

export default function Map({
  loc = DEFAULT_COORDINATES,
  onReady,
  enableRecenterButton = false,
}: {
  loc?: Coordinates;
  onReady?: (map: naver.maps.Map) => void;
  enableRecenterButton?: boolean;
}) {
  const mapRef = useRef<NaverMap>(null);

  const initializeMap = useCallback(() => {
    if (!window.naver?.maps?.LatLng || !loc) return;

    const [lng, lat] = loc; // ✅ 순서 주의: [Lng, Lat] → (lat, lng)
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
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_CLIENT_ID}`}
        onReady={initializeMap}
      />
      <div id={mapId} style={{ width: "100%", height: "100%" }} />
      {enableRecenterButton && (
        <button type="button" onClick={recenter} className="fixed top-[20vh] right-[5vw]">
          <Image
            src={Located}
            alt="현위치"
            width={40}
            height={40}
          />
        </button>
      )}
    </>
  );
}

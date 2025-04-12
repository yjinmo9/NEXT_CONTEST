"use client";
 
export type NaverMap = naver.maps.Map;
type Lng = number;
type Lat = number;
export type Coordinates = [Lng, Lat];

import Map from "./map"

import { useEffect, useState } from "react";
 
export default function NaverMap() {
  const [loc, setLoc] = useState<Coordinates>();
 
  const initLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLoc([position.coords.longitude, position.coords.latitude]);
    });
  };
 
  useEffect(() => {
    initLocation();
  }, []);
 
  return loc && <Map loc={loc} />;
}
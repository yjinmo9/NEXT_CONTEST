'use client';

import Map, { Coordinates } from '@/components/home/map';
import Image from 'next/image';
import Marker from '@/src/img/Marker.png'
import { useCallback, useRef, useState } from 'react';

export default function MapWithFixedMarkerOverlay({
    loc,
    onCenterChange,
    onConfirm,
}: {
    loc: Coordinates;
    onCenterChange?: (coords: Coordinates) => void;
    onConfirm?: () => void;
}) {
    const [locate, setLocate] = useState<string | null>('');

    const handleMapReady = useCallback((map: naver.maps.Map) => {
        const center = map.getCenter() as naver.maps.LatLng;
        onCenterChange?.([center.lat(), center.lng()]);

        naver.maps.Event.addListener(map, 'dragend', async () => {
            const newCenter = map.getCenter() as naver.maps.LatLng;
            onCenterChange?.([newCenter.lat(), newCenter.lng()]);

            const res = await fetch(
                `/api/location?lat=${newCenter.lat()}&lon=${newCenter.lng()}`
            );
            const data = await res.json();

            const roadAddr = data.results?.find((r: any) => r.name === 'roadaddr');
            const fullAddr = [
                roadAddr?.region?.area1?.name,
                roadAddr?.region?.area2?.name,
                roadAddr?.land?.name,
                roadAddr?.land?.number1,
            ]
                .filter(Boolean)
                .join(' ');

            setLocate(fullAddr);
        });
    }, [onCenterChange]);

    return (
        <div className="relative w-full h-full">
            <Map loc={loc} onReady={handleMapReady} enableRecenterButton={true}/>
            <div className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-full flex flex-col items-center">
                <div className="mb-2 w-[300px] text-center bg-white px-4 py-3 rounded-xl shadow-lg drop-shadow-md border border-[1px] border-gray-description">
                    <p className="text-sm text-black">
                        {locate}
                    </p>
                    <button className="mt-2 bg-black text-white text-sm px-4 py-1 rounded-[10px]" onClick={onConfirm} type='button'>
                        이 위치로 신고하기
                    </button>
                </div>

                <Image
                    src={Marker}
                    alt="고정 마커"
                    width={30}
                    height={40}
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                />
            </div>
        </div>

    );
}

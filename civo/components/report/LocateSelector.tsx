
import { Label } from "@/components/ui/label";
import {  useEffect, useState } from 'react';
import Image from "next/image";
import AutoLocationFetcher from "@/components/report/AutoLocationFetcher";
import { Coordinates } from '@/components/home/map';
import searchGlyphImg from '@/src/img/Search Glyph.png';
import MapWithMarker from "./MapwithMarker";

export default function LocateSelector({onLocateChange}:{onLocateChange?:(locate: string)=>void;}) {
    const [locate, setLocate] = useState<string | null>('');

    const [locateChoice, setLocateChoice] = useState<boolean>(false);

    const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);

    const [loc, setLoc] = useState<Coordinates>();

    const initLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLoc([position.coords.longitude, position.coords.latitude]);
        });
    };

    useEffect(() => {
        initLocation();
    }, []);

    const handleLocationConfirm = async () => {
        console.log(selectedLocation)
        if (!selectedLocation) return;

        const res = await fetch(
            `/api/location?lat=${selectedLocation[0]}&lon=${selectedLocation[1]}`
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
        onLocateChange?.(fullAddr);
        setLocateChoice(false);
    }
    return (<div>
        {locateChoice && loc && (
            <div className="relative w-full h-screen overflow-hidden px-[20px] z-20">
                <div className="fixed inset-0 z-0">
                    <MapWithMarker
                        loc={loc}
                        onCenterChange={setSelectedLocation}
                        onConfirm={handleLocationConfirm}
                    />
                </div>
                <div
                    id="searchfield"
                    className="fixed inset-0 mt-[108px] mx-[10px] pt-[8px] pb-[7px] pl-[8px] pr-[8px] h-[36px] z-20 bg-white rounded-[10px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] flex gap-[8px] pointer-events-auto"
                >
                    <Image src={searchGlyphImg} alt="돋보기" width={21} height={19} />
                    <input placeholder="지역/사건 검색하기" className="w-full text-[13px]" />
                </div>
            </div>
        )}
        <div id="사고 위치">
            <Label htmlFor="locate" className="font-semibold text-[15px]">사고 위치 <span className="text-red-700">*</span></Label>
            <div className={`py-[8px] mt-[12px] border rounded-[10px] border-formborder flex flex-col justify-center px-4 gap-[10px] ${locate ? "text-black" : "text-description"}`}>
                {locate ? (
                    <span>{locate}</span>
                ) : (
                    <AutoLocationFetcher />
                )}
                <button
                    type="button"
                    className="text-[15px] text-gray-500 border border-gray-500 border-[0.8px] rounded-[10px] px-3 py-[2px] w-[155px] h-[30px]"
                    onClick={() => setLocateChoice(true)}
                >
                    이 위치가 아닌가요?
                </button>
            </div>

        </div>
    </div>
    )
}
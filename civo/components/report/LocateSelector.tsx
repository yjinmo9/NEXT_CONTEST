
import { Label } from "@/components/ui/label";
import { useEffect, useState } from 'react';
import Image from "next/image";
import AutoLocationFetcher from "@/components/report/AutoLocationFetcher";
import { Coordinates } from '@/components/home/map';
import searchGlyphImg from '@/src/img/Search Glyph.png';
import MapWithMarker from "./MapwithMarker";


interface AddressSuggestion {
    name: string;
    coordinates: Coordinates;
}


export default function LocateSelector({ onLocateChange, name = "사고 위치 " }: { onLocateChange?: ({ loc, locStr }: { loc: Coordinates, locStr: string }) => void , name?:string}) {
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [locate, setLocate] = useState<string>('');

    const [locateChoice, setLocateChoice] = useState<boolean>(false);

    const [selectedLocation, setSelectedLocation] = useState<Coordinates>([0, 0]);

    const [loc, setLoc] = useState<Coordinates>([0, 0]);

    const initLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLoc([position.coords.longitude, position.coords.latitude]);
            onLocateChange?.({loc:[position.coords.longitude, position.coords.latitude], locStr:'불러오는중'});
        });
    };

    useEffect(() => {
        initLocation();
    }, []);


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query?.length > 1) {
                // 주소 자동완성 API 호출
                fetch(`/api/address-autocomplete?query=${encodeURIComponent(query)}`)
                    .then((res) => res.json())
                    .then((data) => {

                        const results = data.results.map((item: any) => ({
                            name: item.address,
                            coordinates: { lat: item.lat, lng: item.lng },
                        }));
                        console.log(results)
                        setSuggestions(results);
                        setShowSuggestions(true);
                    });
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleLocationConfirm = async () => {
        if (!selectedLocation) return;

        const res = await fetch(
            `/api/location?lat=${selectedLocation[1]}&lon=${selectedLocation[0]}`
        );
        const data = await res.json();

        const roadAddr = data.results?.find((r: any) => r.name === 'roadaddr');
        const fullAddr = [
            roadAddr?.region?.area1?.name,
            roadAddr?.region?.area2?.name,
            roadAddr?.land?.name,
            roadAddr?.land?.number1,
            roadAddr?.land?.number2,
            roadAddr?.land?.addition0?.value,
        ]
            .filter(Boolean)
            .join(' ');

        setLocate(fullAddr);
        onLocateChange?.({ loc: selectedLocation, locStr: fullAddr });
        setLocateChoice(false);
    }

    const handleSelect = (suggestion: AddressSuggestion) => {
        onLocateChange?.({ loc: suggestion.coordinates, locStr: suggestion.name });
        setShowSuggestions(false);
        setLocate(suggestion.name ?? '');
        setLocateChoice(false);
    };

    return (<div>
        {locateChoice && loc && (
            <div className="relative w-full h-screen overflow-hidden px-[20px] z-20">
                <div className="fixed inset-0 z-40">
                    <MapWithMarker
                        loc={loc}
                        onCenterChange={setSelectedLocation}
                        onConfirm={handleLocationConfirm}
                    />
                    {showSuggestions && (
                        <div className="absolute inset-0 z-10 bg-white pointer-events-auto" />
                    )}
                </div>

                <div
                    id="searchfield"
                    className={`fixed inset-0 mt-[108px] mx-[10px] pt-[8px] pb-[7px] pl-[8px] pr-[8px] h-[36px] z-40 ${showSuggestions ? "bg-gray-100" : "bg-white"} rounded-[10px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] flex gap-[8px] pointer-events-auto`}
                >
                    <Image src={searchGlyphImg} alt="돋보기" width={21} height={19} />
                    <input
                        type="text"
                        placeholder="지역 검색"
                        className={`w-full text-[13px] ${showSuggestions ? "bg-gray-100" : "bg-white"}`}
                        value={query}
                        onChange={(e) => { setShowSuggestions(true); setQuery(e.target.value ?? ''); }}
                    />{
                        query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="absolute mb-[10px] right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        )
                    }
                </div>
                {showSuggestions && (
                    <div className="fixed inset-0 mt-[175px] mx-[15px] z-50 rounded-t-10px text-gray-600 flex flex-col">
                        <div className="px-[10px] text-[15px] font-semibold">추천</div>
                        <ul className="px-[10px] bg-white w-full mt-1">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="px-[5px] hover:bg-gray-100 cursor-pointer h-[22px] w-full text-[15px] rounded-[5px] flex gap-[5px]"
                                    onClick={() => handleSelect(suggestion)}
                                >
                                    <Image src={searchGlyphImg} alt="돋보기" width={13.5} height={12} className="py-[4px]" />
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        )}
        <div id="사고 위치">
            <Label htmlFor="locate" className="font-semibold text-[15px]">{name} <span className="text-red-700">*</span></Label>
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
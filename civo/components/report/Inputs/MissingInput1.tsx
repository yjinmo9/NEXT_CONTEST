// ReportInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TextareaAutosize from "react-textarea-autosize"
import { useRouter } from "next/navigation";
import { useMissingForm } from "@/app/context/MissingFormContext";
import LocateSelector from "../LocateSelector";
import { useEffect, useState } from "react";
import { Coordinates } from "@/components/home/map";

export default function MissingInput1() {
    const router = useRouter();
    const { data, setData } = useMissingForm();

    const isValid =
        data.name.trim() !== "" &&
        data.content.trim() !== "" &&
        data.gender.trim() !== "" &&
        data.age !== 0;

    const [locStr, setLocStr] = useState<string | null>('');
    const [loc, setLoc] = useState<Coordinates | null>(null);

    const handleLocationChange = ({ loc, locStr }: { loc: Coordinates, locStr: string }) => {
        setLocStr(locStr);
        setLoc(loc);
      
        // 🔥 missing_lat, missing_lng 저장
        setData({
          ...data,
          missing_lat: loc[0],  // 위도
          missing_lng: loc[1],  // 경도
        });
      };

    
    const initLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLoc([position.coords.longitude, position.coords.latitude]);
        });
    };

    useEffect(() => {
        initLocation();
    }, []);
    
    return (
        <form className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto" encType="multipart/form-data">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <input type="hidden" name="type" value="missing" />
                <div id="이름">
                    <Label htmlFor="name" className="font-semibold text-[15px]">
                        실종자 이름 <span className="text-red-700">*</span>
                    </Label>
                    <Input
                        name="name"
                        placeholder="실종자의 이름을 입력해주세요"
                        className="mt-[12px] h-[52px] border rounded-[10px] border-formborder placeholder-description"
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        required
                    />
                </div>
                <div id="나이 성별" className="flex flex-col">
                    <Label htmlFor="age-gender" className="font-semibold text-[15px]">
                        나이 / 성별 <span className="text-red-700">*</span>
                    </Label>
                    <p className="text-[14px] text-description mt-[10px]">
                        실종자는 현재{" "}
                        <select
                            value={data.age === 0 ? "나이" : data.age}
                            onChange={(e) =>
                                setData({ ...data, age: parseInt(e.target.value) || 0 })
                            }
                            className="border-b border-black appearance-none focus:outline-none px-1 bg-transparent text-black font-semibold"
                        >
                            <option disabled>나이</option>
                            <option value={10}>10대</option>
                            <option value={20}>20대</option>
                            <option value={30}>30대</option>
                            <option value={40}>40대</option>
                            <option value={50}>50대</option>
                            <option value={60}>60대 이상</option>
                        </select>{" "}
                        <select
                            value={data.gender || "성별"}
                            onChange={(e) => setData({ ...data, gender: e.target.value })}
                            className="border-b border-black appearance-none focus:outline-none px-1 bg-transparent text-black font-semibold"
                        >
                            <option disabled>성별</option>
                            <option value="남성">남성</option>
                            <option value="여성">여성</option>
                        </select>{" "}
                        입니다.
                    </p>
                </div>
                <LocateSelector onLocateChange={handleLocationChange} name="실종 위치 " />
                <div id="실종 상황" className="flex flex-col">
                    <Label htmlFor="content" className="font-semibold text-[15px]">
                        실종 당시 상황 <span className="text-red-700">*</span>
                    </Label>
                    <TextareaAutosize
                        className="mt-[12px] min-h-[calc(100vh-800px)] py-[10px] px-[15px] border rounded-[10px] border-formborder placeholder-description"
                        name="content"
                        placeholder="실종 당시 상황을 자세하게 입력해주세요"
                        onChange={(e) => setData({ ...data, content: e.target.value })}
                        required
                    />
                </div>
                <button
                    type="button"
                    disabled={!isValid}
                    onClick={() => router.push("/report/missing/2")}
                    className={`h-[53px] rounded-[10px] w-full text-sm font-semibold transition ${isValid
                        ? "bg-black text-white"
                        : "bg-gray-300 text-black cursor-not-allowed"
                        }`}
                >
                    다음
                </button>
            </div>
        </form>
    );
}

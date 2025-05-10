"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TextareaAutosize from "react-textarea-autosize"
import {useState } from 'react';
import { useRouter } from "next/navigation";
import { useDamageForm } from "@/app/context/DamageFormContext";
import { Coordinates } from '@/components/home/map';
import LocateSelector from "../LocateSelector";

export default function DamageInput1() {
    const router = useRouter();
    const { data, setData } = useDamageForm();
    const isValid = data.title.trim() !== '' && data.content.trim() !== '';
    const [locStr, setLocStr] = useState<string | null>('');
    const [loc, setLoc] = useState<Coordinates | null>(null);

    const handleLocationChange = ({ loc, locStr }: { loc: Coordinates, locStr: string }) => {
        setLocStr(locStr)
        setLoc(loc)
    }
    return (
        <form className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto" encType="multipart/form-data">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <div id="파손신고 제목">
                    <Label htmlFor="title" className="font-semibold text-[15px]">파손신고 제목 <span className="text-red-700">*</span></Label>
                    <Input name="title" placeholder="파손신고 제목을 입력해주세요" className="mt-[12px] h-[52px] border rounded-[10px] border-formborder placeholder-description" onChange={(e) => setData({ title: e.target.value })} required />
                </div>
                <LocateSelector onLocateChange={handleLocationChange} />
                <div id="파손 내용" className="flex flex-col">
                    <Label htmlFor="content" className="font-semibold text-[15px]">파손 내용 <span className="text-red-700">*</span></Label>
                    <TextareaAutosize className="mt-[12px] min-h-[calc(100vh-600px)] py-[10px] px-[15px] border rounded-[10px] border-formborder placeholder-description" name="content" placeholder="파손 내용을 작성해주세요" onChange={(e) => setData({ content: e.target.value })} required />
                </div>
                <input type="hidden" name="report_lat">{loc?.[1]}</input>
                <input type="hidden" name="report_lng">{loc?.[0]}</input>
                <button
                    type="button"
                    disabled={!isValid}
                    onClick={() => router.push('/report/damage/2')}
                    className={`h-[53px] rounded-[10px] w-full text-sm transition ${isValid ? 'bg-black text-white' : 'bg-gray-300 text-black font-semibold cursor-not-allowed'
                        }`}
                >
                    다음
                </button>
            </div>
        </form>
    )
}
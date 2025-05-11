import { useEffect, useRef, useState } from "react";
import { Coordinates } from "../../home/map";
import LocateSelector from "../LocateSelector";
import { Label } from "../../ui/label";
import {Input} from "../../ui/input"
import TextareaAutosize from "react-textarea-autosize"
import { SubmitButton } from "../../submit-button";
import { postAction } from "@/app/actions";
import ImageInput from "../ImageInput";

export default function IncidentInput() {
    const categories = ['화재', '인구밀집', '교통사고', '기타'];
    const [selected, setSelected] = useState<string | null>(null);
    const [loc, setLoc] = useState<Coordinates>([127.02, 37.58]);
    const [userloc, setUserloc] = useState<Coordinates>([0, 0]);

    const handleLocationChange = ({ loc, locStr }: { loc: Coordinates, locStr: string }) => {
        setLoc(loc)
    }

    const initLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserloc([position.coords.longitude, position.coords.latitude]);
        });
    };

    useEffect(() => {
        initLocation();
    }, []);

    return (
        <form className="pb-[100px] flex-1 flex flex-col min-w-64 h-full pointer-events-auto" encType="multipart/form-data">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <input type="hidden" name="type" value="incident" />
                <div id="사고유형">
                    <Label htmlFor="category" className="font-semibold text-[15px]">사고 유형 <span className="text-red-700">*</span></Label>
                    <div className="mt-[12px] h-[30px] flex flex-wrap gap-2">
                        {categories.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSelected(type)}
                                className={`px-4 py-1 text-sm border rounded-[10px] transition 
                        ${selected === type
                                        ? 'bg-black text-white border-black'
                                        : 'text-black border-black hover:bg-gray-100'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                {selected && (
                    <input type="hidden" name="category" value={selected} />
                )}
                <LocateSelector onLocateChange={handleLocationChange} />
                <div id="신고 제목">
                    <Label htmlFor="title" className="font-semibold text-[15px]">신고 제목 <span className="text-red-700">*</span></Label>
                    <Input name="title" placeholder="신고 제목을 입력해주세요" className="mt-[12px] h-[52px] border rounded-[10px] border-formborder placeholder-description" required />
                </div>
                <div id="사진/영상">
                    <Label htmlFor="file-upload" className="font-semibold text-[15px]">사진 · 영상 <span className="text-red-700">*</span></Label>
                    <p className="mt-[12px] text-description text-[15px]">사고를 파악할 수 있는 사진/영상을 업로드해 주세요.</p>
                    <ImageInput className="mt-[10px] flex gap-4" w={126} h={126}/>
                </div>
                <div id="사고 내용" className="flex flex-col">
                    <Label htmlFor="content" className="font-semibold text-[15px]">사고 내용</Label>
                    <TextareaAutosize className="mt-[12px] min-h-[176px] py-[10px] px-[15px] border rounded-[10px] border-formborder placeholder-description" name="content" placeholder="사고내용을 작성해주세요" required />
                </div>
                <input type="hidden" name="report_lng" value={typeof loc?.[1] === 'number' ? loc[1] : ''} />
                <input type="hidden" name="report_lat" value={typeof loc?.[0] === 'number' ? loc[0] : ''} />

                <input type="hidden" name="user_lng" value={typeof userloc?.[1] === 'number' ? userloc[1] : ''} />
                <input type="hidden" name="user_lat" value={typeof userloc?.[0] === 'number' ? userloc[0] : ''} />

                <SubmitButton pendingText="제출 중..." formAction={postAction} className="h-[53px]">
                    신고하기
                </SubmitButton>
            </div>
        </form>
    )
}
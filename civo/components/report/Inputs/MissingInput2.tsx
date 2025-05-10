"use client";

import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { postAction } from "@/app/actions";
import { useMissingForm } from "@/app/context/MissingFormContext";
import ImageInput from "../ImageInput";


export default function MissingInput2() {
    const { data } = useMissingForm()

    return (
        <form encType="multipart/form-data" className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <input type="hidden" name="type" value="missing" />
                <input type="hidden" name="title" value={data.name} />
                <input type="hidden" name="content" value={data.content} />
                <input type="hidden" name="missing_name" value={data.name} />
                <input type="hidden" name="missing_age" value={data.age.toString()} /> {/* 숫자를 문자열로 변환 */}
                <input type="hidden" name="missing_gender" value={data.gender} />

                <div id="사진">
                    <Label htmlFor="file-upload" className="font-semibold text-[15px]">사진 <span className="text-red-700">*</span></Label>
                    <p className="mt-[12px] text-description text-[15px]">실종자의 생김새나 인상착의를 파악할 수 있는 사진을 업로드해 주세요.</p>
                    <ImageInput className="mt-[10px] flex flex-col gap-4 items-center" />
                </div>

                <SubmitButton
                    formAction={postAction}
                    pendingText="제출 중..."
                    className="h-[53px] bg-black text-white rounded-[10px]"
                >
                    신고하기
                </SubmitButton>
            </div>
        </form>
    )
}
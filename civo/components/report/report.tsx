// ReportInput.tsx
"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import  TextareaAutosize  from "react-textarea-autosize"
import { postAction } from "@/app/actions";
import { useRef, useState } from 'react';
import Image from "next/image";

export default function ReportInput() {
    const types = ['화재', '인구밀집', '교통사고', '기타'];
    const [selected, setSelected] = useState<string | null>(null);

    const [file, setFile] = useState<File | null>(null);

    const [preview, setPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) {
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
      }
    };
  
    const handleUpload = async () => {
      if (!file) return;
  
      const formData = new FormData();
      formData.append('image', file);
  
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      const result = await res.json();
      alert(`업로드 완료: ${result.filename}`);
    };

    return(
        <form className="pb-[100px] flex-1 flex flex-col min-w-64 h-full pointer-events-auto">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <div id="사고유형">
                <Label htmlFor="togle" className="font-semibold text-[15px]">사고 유형 <span className="text-red-700">*</span></Label>
                <div className="mt-[12px] h-[30px] flex flex-wrap gap-2">
                    {types.map((type) => (
                        <button
                        key={type}
                        type="button"
                        onClick={() => setSelected(type)}
                        className={`px-4 py-1 text-sm border rounded-[10px] transition 
                        ${
                        selected === type
                        ? 'bg-black text-white border-black'
                        : 'text-black border-black hover:bg-gray-100'
                        }`}
                        >
                        {type}
                        </button>
                    ))}
                </div>
                </div>
                <div id="신고 제목">
                    <Label htmlFor="title" className="font-semibold text-[15px]">신고 제목 <span className="text-red-700">*</span></Label>
                    <Input name="title" placeholder="신고 제목을 입력해주세요" className="mt-[12px] h-[52px] border rounded-[10px] border-formborder placeholder-description" required />
                </div>
                <div id="사진/영상">
                    <Label htmlFor="file-upload" className="font-semibold text-[15px]">사진 · 영상 <span className="text-red-700">*</span></Label>
                    <p className="mt-[12px] text-description text-[15px]">사고를 파악할 수 있는 사진/영상을 업로드해 주세요.</p>
                    <div className="mt-[10px] flex gap-4">

                    {preview && (
                    <div className="w-[126px] h-[126px] rounded-lg overflow-hidden border border-gray-300">
                        <Image
                        src={preview}
                        alt="미리보기"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                        />
                    </div>
                    )}

                    <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-[126px] h-[126px] rounded-lg border border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100"
                    >
                    <span className="text-2xl">＋</span>
                    </div>

                    <input
                    type="file"
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    />          
                    </div>
                </div>
                <div id="사고 내용" className="flex flex-col">
                    <Label htmlFor="content" className="font-semibold text-[15px]">사고 내용</Label>
                    <TextareaAutosize className="mt-[12px] min-h-[176px] py-[10px] px-[15px] border rounded-[10px] border-formborder placeholder-description" name="content" placeholder="사고내용을 작성해주세요" required/>
                </div>
                <SubmitButton pendingText="Posting.." formAction={postAction} className="h-[53px]">
                    신고하기
                </SubmitButton>
            </div>
        </form>
    )
}

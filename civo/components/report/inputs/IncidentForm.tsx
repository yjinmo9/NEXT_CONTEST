// components/report/IncidentForm.tsx
"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TextareaAutosize from "react-textarea-autosize";
import { SubmitButton } from "@/components/submit-button";
import { postAction } from "@/app/actions";
import { Coordinates } from "@/components/home/map";
import CategorySelector from "../shared/CategorySelector";
import { LocationSelector } from "../shared/LocationSelector";
import { UploadInput } from "../shared/UploadInput";

export default function IncidentForm() {
  const [category, setCategory] = useState<string | null>(null);
  const [locationText, setLocationText] = useState<string>("");
  const [locationCoords, setLocationCoords] = useState<Coordinates | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");

  return (
    <form
      className="pb-[100px] flex-1 flex flex-col min-w-64 h-full pointer-events-auto"
      encType="multipart/form-data"
    >
      <input type="hidden" name="type" value="incident" />
      <input type="hidden" name="category" value={category || ""} />
      <input type="hidden" name="report_lat" value={locationCoords?.[1] || ""} />
      <input type="hidden" name="report_lng" value={locationCoords?.[0] || ""} />
      <input type="hidden" name="media_urls" value={fileUrl} />

      <CategorySelector value={category} onChange={setCategory} />
      <LocationSelector
        value={locationText}
        onChange={setLocationText}
        onCoordsChange={setLocationCoords}
      />

      <div>
        <Label htmlFor="title" className="font-semibold text-[15px]">
          신고 제목 <span className="text-red-700">*</span>
        </Label>
        <Input
          name="title"
          placeholder="신고 제목을 입력해주세요"
          className="mt-[12px] h-[52px] border rounded-[10px] border-formborder placeholder-description"
          required
        />
      </div>

      <UploadInput onUpload={setFileUrl} />

      <div className="flex flex-col">
        <Label htmlFor="content" className="font-semibold text-[15px]">
          사고 내용
        </Label>
        <TextareaAutosize
          className="mt-[12px] min-h-[176px] py-[10px] px-[15px] border rounded-[10px] border-formborder placeholder-description"
          name="content"
          placeholder="사고내용을 작성해주세요"
          required
        />
      </div>

      <SubmitButton pendingText="Posting.." formAction={postAction} className="h-[53px]">
        신고하기
      </SubmitButton>
    </form>
  );
}
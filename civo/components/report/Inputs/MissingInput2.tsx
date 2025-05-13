"use client";

import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { postAction } from "@/app/actions";
import { useMissingForm } from "@/app/context/MissingFormContext";
import ImageInput from "../ImageInput";
import { useEffect, useState } from "react";
import { Coordinates } from "@/components/home/map";

export default function MissingInput2() {
  const { data } = useMissingForm();

  const [userloc, setUserloc] = useState<Coordinates | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);

  // ✅ 현재 위치 받아오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const loc: Coordinates = [position.coords.longitude, position.coords.latitude];
      setUserloc(loc);

      // ✅ 현재 위치 콘솔 출력
      console.log("📍 사용자 현재 위치(userloc):", loc);
    });
  }, []);

  // ✅ MissingForm 데이터 콘솔 출력
  useEffect(() => {
    console.log("🛰️ Missing 위치 (missing_lat/lng):", data.missing_lat, data.missing_lng);
    console.log("🧾 Missing 정보 전체:", data);
  }, [data]);

  return (
    <form encType="multipart/form-data" className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto">
      <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
        <input type="hidden" name="type" value="missing" />
        <input type="hidden" name="title" value={data.name} />
        <input type="hidden" name="content" value={data.content} />
        <input type="hidden" name="missing_name" value={data.name} />
        <input type="hidden" name="missing_age" value={data.age.toString()} />
        <input type="hidden" name="missing_gender" value={data.gender} />

        {/* ✅ 사용자 현재 위치 */}
        <input type="hidden" name="user_lat" value={userloc?.[1] ?? ''} />
        <input type="hidden" name="user_lng" value={userloc?.[0] ?? ''} />

        {/* ✅ 실종 위치 */}
        <input type="hidden" name="missing_lat" value={data.missing_lat ?? ''} />
        <input type="hidden" name="missing_lng" value={data.missing_lng ?? ''} />

        <div id="사진">
          <Label htmlFor="file-upload" className="font-semibold text-[15px]">
            사진 <span className="text-red-700">*</span>
          </Label>
          <p className="mt-[12px] text-description text-[15px]">
            실종자의 생김새나 인상착의를 파악할 수 있는 사진을 업로드해 주세요.
          </p>
          <ImageInput
            className="mt-[10px] flex flex-col gap-4 items-center"
            w={362}
            h={365}
            setUploadingStatus={setUploadingStatus}
          />
        </div>

        <SubmitButton
          formAction={postAction}
          pendingText="제출 중..."
          className={`h-[53px] rounded-[10px] w-full text-sm font-semibold transition ${
            uploadingStatus ? "bg-black text-white" : "bg-gray-300 text-black cursor-not-allowed"
          }`}
        >
          신고하기
        </SubmitButton>
      </div>
    </form>
  );
}


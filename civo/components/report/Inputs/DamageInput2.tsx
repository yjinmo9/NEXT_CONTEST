'use client';

import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { postAction } from "@/app/actions";
import { useEffect, useState } from 'react';
import { useDamageForm } from "@/app/context/DamageFormContext";
import { Coordinates } from '@/components/home/map';
import ImageInput from "../ImageInput";

export default function DamageInput2() {
  const { data } = useDamageForm();

  const [userloc, setUserloc] = useState<Coordinates | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserloc([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  return (
    <form
      encType="multipart/form-data"
      className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto"
    >
      <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
        {/* 이미지 업로드 */}
        <div id="사진/영상">
          <Label htmlFor="file-upload" className="font-semibold text-[15px]">
            사진 <span className="text-red-700">*</span>
          </Label>
          <p className="mt-[12px] text-description text-[15px]">
            기물파손 상태를 파악할 수 있는 사진을 업로드해 주세요.
          </p>
          <ImageInput
            className="mt-[10px] flex flex-col gap-4 items-center"
            w={362}
            h={365}
            setUploadingStatus={setUploadingStatus}
          />
        </div>

        {/* ✅ 숨겨진 필드들 (formData로 전송) */}
        <input type="hidden" name="title" value={data.title ?? ''} />
        <input type="hidden" name="content" value={data.content ?? ''} />
        <input type="hidden" name="type" value="damage" />
        <input type="hidden" name="category" value="기물파손" />

        <input type="hidden" name="user_lat" value={userloc?.[0] ?? ''} />
        <input type="hidden" name="user_lng" value={userloc?.[1] ?? ''} />

        {/* ✅ 빠졌던 부분: 신고 위치 */}
        <input type="hidden" name="report_lat" value={data.report_lat ?? ''} />
        <input type="hidden" name="report_lng" value={data.report_lng ?? ''} />

        <SubmitButton
          formAction={postAction}
          pendingText="제출 중..."
          className={`h-[53px] rounded-[10px] w-full text-sm font-semibold transition ${uploadingStatus
                        ? "bg-black text-white"
                        : "bg-gray-300 text-black cursor-not-allowed"
                        }`}
        >
          신고하기
        </SubmitButton>
      </div>
    </form>
  );
}

// 📄 DamageFormStep2.tsx
"use client";

import { UploadInput } from "../shared/UploadInput";
import { useDamageForm } from "@/app/context/DamageFormContext";
import { SubmitButton } from "@/components/submit-button";
import { postAction } from "@/app/actions";

export default function DamageFormStep2() {
  const { data } = useDamageForm();

  return (
    <form className="flex flex-col gap-8 px-4" encType="multipart/form-data">
      <UploadInput onUpload={function (url: string): void {
        throw new Error("Function not implemented.");
      } } />
      <input type="hidden" name="type" value="damage" />
      <input type="hidden" name="title" value={data.title} />
      <input type="hidden" name="content" value={data.content} />

      <SubmitButton formAction={postAction} pendingText="제출 중...">
        신고하기
      </SubmitButton>
    </form>
  );
}
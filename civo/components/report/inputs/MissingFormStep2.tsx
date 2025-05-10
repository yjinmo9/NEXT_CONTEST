// 📄 MissingFormStep2.tsx
"use client";

import { UploadInput } from "../shared/UploadInput";
import { useMissingForm } from "@/app/context/MissingFormContext";
import { SubmitButton } from "@/components/submit-button";
import { postAction } from "@/app/actions";

export default function MissingFormStep2() {
  const { data } = useMissingForm();

  return (
    <form className="flex flex-col gap-8 px-4" encType="multipart/form-data">
      <UploadInput onUpload={function (url: string): void {
        throw new Error("Function not implemented.");
      } } />
      <input type="hidden" name="type" value="missing" />
      <input type="hidden" name="title" value={data.name} />
      <input type="hidden" name="content" value={data.content} />
      <input type="hidden" name="missing_name" value={data.name} />
      <input type="hidden" name="missing_age" value={data.age.toString()} />
      <input type="hidden" name="missing_gender" value={data.gender} />

      <SubmitButton formAction={postAction} pendingText="제출 중...">
        신고하기
      </SubmitButton>
    </form>
  );
}

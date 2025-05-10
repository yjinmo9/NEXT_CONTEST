// 📄 DamageFormStep1.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useDamageForm } from "@/app/context/DamageFormContext";
import TextareaAutosize from "react-textarea-autosize";
import { LocationSelector } from "../shared/LocationSelector";
import { Coordinates } from "@/components/home/map";

export default function DamageFormStep1() {
  const router = useRouter();
  const { data, setData } = useDamageForm();
  const isValid = data.title.trim() !== '' && data.content.trim() !== '';

  return (
    <form className="flex flex-col gap-8 px-4">
      <div>
        <Label htmlFor="title">파손신고 제목 *</Label>
        <Input
          name="title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="파손신고 제목을 입력해주세요"
          required
        />
      </div>

      <LocationSelector value={""} onChange={function (value: string): void {
        throw new Error("Function not implemented.");
      } } onCoordsChange={function (coords: Coordinates): void {
        throw new Error("Function not implemented.");
      } } />

      <div>
        <Label htmlFor="content">파손 내용 *</Label>
        <TextareaAutosize
          name="content"
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          placeholder="파손 내용을 작성해주세요"
          required
          className="border rounded-md p-2"
        />
      </div>

      <button
        type="button"
        disabled={!isValid}
        onClick={() => router.push("/report/damage/2")}
        className={`btn ${isValid ? 'bg-black text-white' : 'bg-gray-300 text-black cursor-not-allowed'}`}
      >
        다음
      </button>
    </form>
  );
}
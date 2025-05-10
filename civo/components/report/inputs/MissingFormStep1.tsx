// 📄 MissingFormStep1.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useMissingForm } from "@/app/context/MissingFormContext";
import TextareaAutosize from "react-textarea-autosize";

export default function MissingFormStep1() {
  const router = useRouter();
  const { data, setData } = useMissingForm();

  const isValid =
    data.name.trim() !== "" &&
    data.content.trim() !== "" &&
    data.gender.trim() !== "" &&
    data.age !== 0;

  return (
    <form className="flex flex-col gap-8 px-4">
      <Input
        name="name"
        placeholder="실종자 이름"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        required
      />

      <div className="flex gap-2">
        <select
          value={data.age || ""}
          onChange={(e) => setData({ ...data, age: parseInt(e.target.value) || 0 })}
          required
        >
          <option value="">나이 선택</option>
          <option value={10}>10대</option>
          <option value={20}>20대</option>
          <option value={30}>30대</option>
          <option value={40}>40대</option>
        </select>
        <select
          value={data.gender || ""}
          onChange={(e) => setData({ ...data, gender: e.target.value })}
          required
        >
          <option value="">성별 선택</option>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>
      </div>

      <TextareaAutosize
        name="content"
        placeholder="실종 당시 상황을 입력해주세요"
        value={data.content}
        onChange={(e) => setData({ ...data, content: e.target.value })}
        className="border rounded-md p-2"
        required
      />

      <button
        type="button"
        disabled={!isValid}
        onClick={() => router.push("/report/missing/2")}
        className={`btn ${isValid ? 'bg-black text-white' : 'bg-gray-300 text-black cursor-not-allowed'}`}
      >
        다음
      </button>
    </form>
  );
}
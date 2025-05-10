// shared/UploadInput.tsx
"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export function UploadInput({ onUpload }: { onUpload: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const result = await res.json();

    if (!res.ok) {
      console.error("Upload error:", result.error);
      return;
    }

    onUpload(result.url);
  };

  return (
    <>
      {preview && <Image src={preview} alt="preview" width={200} height={200} />}
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        업로드
      </button>
    </>
  );
}

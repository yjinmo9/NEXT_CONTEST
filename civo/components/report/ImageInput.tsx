'use client';

import { useRef, useState } from "react";
import Image from "next/image";

export default function ImageInput({
  className,
  w,
  h,
  setUploadingStatus,
}: {
  className: string;
  w: number;
  h: number;
  setUploadingStatus: (status:boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // ✅ 배열로!
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setUploadingStatus(false)
    
    try {
      const formData = new FormData();
      formData.append("file", selected);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("❌ Upload failed:", result.error || "Unknown error");
        return;
      }

      console.log("✅ 업로드 성공! URL:", result.url);
      setImageUrls([result.url]);
      setUploadingStatus(true)
    } catch (error) {
      console.error("❌ 예외 발생:", error);
    }
  };

  return (
    <div className={className}>
      {preview ? (
        <div
          className="relative rounded-lg overflow-hidden border border-gray-300"
          style={{ width: `${w}px`, height: `${h}px` }}
        >
          <Image
            src={preview}
            alt="미리보기"
            width={w}
            height={h}
            className="object-cover w-full h-full"
          />
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPreview(null);
              setImageUrls([]); // 삭제 시 초기화
            }}
            className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-opacity-100 transition"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-lg border border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100"
          style={{ width: `${w}px`, height: `${h}px` }}
        >
          <span className="text-2xl">＋</span>
          <p className="text-[15px]">사진 업로드</p>
        </div>
      )}

      {/* 실제 파일 선택 input */}
      <input
        type="file"
        name="image"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ✅ FormData 전송을 위한 media_urls hidden input */}
      {imageUrls.map((url, idx) => (
        <input key={idx} type="hidden" name="media_urls" value={url} />
      ))}
    </div>
  );
}

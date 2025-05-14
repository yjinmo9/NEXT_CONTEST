"use client";

import { useState } from "react";
import Image from "next/image";
import EditableField from "@/components/my/editableField"; // 경로는 프로젝트 구조에 맞게 수정

export default function ProfileEditPage() {
    const [name, setName] = useState("양진모");
    const [phone, setPhone] = useState("010-1234-5678");
    const [email, setEmail] = useState("zinzzamo@gmail.com");
    const [password, setPassword] = useState("hellozinmo@!23");

    const [previewUrl, setPreviewUrl] = useState("/img/ProfileAnon.png");
    const [file, setFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (file) formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const result = await res.json();
        if (res.ok) {
            alert("✅ 저장 완료: " + result.url);
        } else {
            alert("❌ 저장 실패: " + result.error);
        }
    };

    return (
        <div className="w-full z-30 bg-white min-h-full px-[20px] py-[16px] max-w-md mx-auto">
            <h1 className="text-[15px] font-semibold mb-[12px]">프로필 수정</h1>

            {/* 프로필 이미지 */}
            <div className="relative w-[114px] aspect-square mx-auto rounded-full mb-6">
                <img
                    src={previewUrl}
                    alt="프로필"
                    className="w-full h-full object-cover object-center rounded-full"
                />
                <label htmlFor="profile-upload">
                    <div className="absolute bottom-0 right-0 bg-white rounded-full shadow cursor-pointer">
                        <Image src="/img/profileEdit.png" alt="수정" width={25} height={25}/>
                    </div>
                </label>
                <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>

            {/* 필드들 */}
            <EditableField label="이름" name="name" value={name} onChange={setName} />
            <EditableField label="전화번호" name="phone" value={phone} onChange={setPhone} />
            <EditableField label="Email" name="email" value={email} onChange={setEmail} type="email" />

            {/* 저장 버튼 */}
            <button
                onClick={handleSubmit}
                className="mt-[100px] h-[44px] w-full bg-black text-white py-2 rounded-xl text-sm font-semibold"
            >
                저장하기
            </button>
        </div>
    );
}

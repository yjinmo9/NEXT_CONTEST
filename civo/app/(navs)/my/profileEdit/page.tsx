"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import EditableField from "@/components/my/editableField"; // 경로는 프로젝트 구조에 맞게 수정
import { getUserIdAction } from "@/app/actions";
import { profile } from "console";

export default function ProfileEditPage() {
    const [previewUrl, setPreviewUrl] = useState("/img/ProfileAnon.png");
    const [file, setFile] = useState<File | null>(null);

    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("익명");
    const [userEmail, setUserEmail] = useState<string>("이메일 없음");
    const [userPhone, setUserPhone] = useState<string>("전화번호 없음");
    const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserInfo() {
            const userId = await getUserIdAction();

            setUserId(userId || "익명"); // ✅ 여기서 바로 user.id 사용

            console.log("🔥 현재 사용자 ID:", userId);

            const res = await fetch(`/api/user/${userId}`)
            const data = await res.json();
            console.log("🔥 사용자 정보:", data);

            if (data) {
                setUserName(data.name);
                setUserEmail(data.email);
                setUserPhone(data.phone);
            } else {
                console.warn("⚠️ 사용자 정보가 비어 있음");
            }
        }
        fetchUserInfo();
    })
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
            setUserProfileImage(result.url);
        } else {
            alert("❌ 저장 실패: " + result.error);
        }

        const url = result.url

        await fetch(`/api/user/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.get("name") || userName,
                email: formData.get("email") || userEmail,  
                phone: formData.get("phone") || userPhone,
                profile_image: url,
            }),
        });

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
                        <Image src="/img/profileEdit.png" alt="수정" width={25} height={25} />
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
            <EditableField label="이름" name="name" value={userName} onChange={setUserName} />
            <EditableField label="전화번호" name="phone" value={userPhone} onChange={setUserPhone} />
            <EditableField label="Email" name="email" value={userEmail} onChange={setUserEmail} type="email" />

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

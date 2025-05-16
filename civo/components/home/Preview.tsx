import Link from "next/link";
import reportImg from '@/src/img/reporter.png';
import Image from "next/image";
import { useEffect, useState } from "react";

type Report = {
    id?: string;
    type: string;
    report_lat: number;
    report_lng: number;
    distance_m?: number | null;
    title?: string;
    category?: string;
    media_url: string;
    created_at?: string;
    content?: string;
    user_id?: string;
};

type userData = {
    id: string;
    name: string;
    email: string;
    phone: string;
    profile_image: string;
}

export default function Preview({ report, handleClose }: { report: Report, handleClose: (report: null) => void }) {
    const [userName, setUserName] = useState<string>("익명");
    const [profileImage, setProfileImage] = useState<string>();

    useEffect(() => {

        const fetchUserData = async (userId: string) => {
            const userRes = await fetch(`/api/user?uid=${userId}`);
            if (!userRes.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData: userData = await userRes.json();
            console.log("🔥 userData:", userData);
            if (!userData) {
                throw new Error("User data not found");
            }
            setProfileImage(userData.profile_image ?? null);
            setUserName(userData.name ?? '익명');
        }
        console.log("🔥 Preview 컴포넌트에서 받은 user_id:", report.user_id);
        fetchUserData(report.user_id || "")
    }, [report.user_id])
    return (
        <div className="bg-white max-h-[228px] overflow-hidden rounded-2xl shadow-lg pointer-events-auto max-w-md mx-auto drop-shadow-[0_0px_6px_rgba(0,0,0,0.15)]">
            <div className="flex">
                <Link
                    href={`/home/reportList/?id=${report.id}`}
                    className="overflow-hidden rounded-l-xl cursor-pointer"
                >
                    <Image
                        width={100}
                        height={100}
                        src={report.media_url || "/placeholder.png"}
                        alt="썸네일"
                        className="w-[30vh] aspect-[3/4] object-cover object-center"
                    />
                    <div className="flex gap-[4px] absolute bottom-[10px] left-[80px] justify-center items-center">
                        <Image
                            src={reportImg}
                            alt="신고 아이콘"
                            width={10}
                            height={10}
                            className="h-[10px] opacity-100" />
                        <div className="text-white text-[11px] font-semibold">{userName}</div>
                        {/*여기 조회수*/}
                    </div>

                </Link>
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                        <Image
                            width={30}
                            height={30}
                            src={profileImage ?? "/img/mypage.png"}
                            alt="프로필"
                            className="aspect-square rounded-full object-cover"
                        />
                        <p className="text-sm font-semibold">{userName || "익명"}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold">{report.title}</p>
                        <p className="text-[8px]">{report.created_at || "날짜 없음"}</p>
                    </div>
                    <p className="text-xs text-gray-700 mt-1 line-clamp-2">{report.content || "설명이 없습니다."}</p>
                </div>
            </div>
            <button className="absolute top-0 right-[10px] text-gray-500" onClick={() => handleClose(null)}>×</button>
        </div>
    );
}
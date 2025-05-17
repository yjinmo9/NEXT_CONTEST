import Link from "next/link";
import reportImg from '@/src/img/reporter.png';
import viewCountImg from '@/public/img/viewCount.png';
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatToKSTWithTime } from "@/utils/utils";

type Report = {
    id?: string;
    type: string;
    report_lat: number;
    report_lng: number;
    distance_m?: number | null;
    title?: string;
    category?: string;
    media_url: string;
    created_at: string;
    content?: string;
    user_id?: string;
    views: number;
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
    const [viewCount, setViewCount] = useState<number>(0);

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
            setViewCount((report.views || 0) + 1);
        }
        console.log("🔥 Preview 컴포넌트에서 받은 user_id:", report.user_id);
        fetchUserData(report.user_id || "")
    }, [report.user_id, report.views]);

    return (
        <div className="bg-white max-h-[228px] overflow-hidden rounded-2xl shadow-lg pointer-events-auto max-w-md mx-auto drop-shadow-[0_0px_6px_rgba(0,0,0,0.15)]">
            <div className="flex">
                <Link
                    href={`/home/reportList/?id=${report.id}`}
                    className="rounded-l-xl cursor-pointer"
                >   <div className="relative w-[40vw] aspect-[3/4] rounded-l-[10px]">
                        {/* 썸네일 이미지 */}
                        <Image
                            width={100}
                            height={100}
                            src={report.media_url || "/placeholder.png"}
                            alt="썸네일"
                            className="h-full aspect-[3/4] object-cover object-center"
                        />

                        {/* 반투명 오버레이 */}
                        <div className="absolute inset-0 bg-black bg-opacity-20 z-10" />

                        {/* 👁️ 텍스트 오버레이 */}
                        <div className="absolute pb-[100px] right-[40px] z-20 flex items-center gap-[6px]">
                            <Image
                                src={reportImg}
                                alt="신고 아이콘"
                                width={12}
                                height={12}
                                className="h-[12px] w-[12px]"
                            />
                            <span className="text-white text-[11px] font-semibold">{userName}</span>
                            <Image
                                src={viewCountImg}
                                alt="조회수 아이콘"
                                width={20}
                                height={12}
                                className="h-[12px] w-[15px]"
                            />
                            <span className="text-white text-[11px] font-semibold">{viewCount}</span>
                        </div>
                        {/* 👁️ 아이콘·텍스트 오버레이 : 바깥 래퍼 좌표계 사용 → 클리핑 X */}
                        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1">
                            <Image src={reportImg} alt="" width={12} height={12} />
                            <span className="text-white text-[11px] font-semibold">{userName}</span>
                            <Image src={viewCountImg} alt="" width={15} height={12} />
                            <span className="text-white text-[11px] font-semibold">{viewCount}</span>
                        </div>
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
                        <p className="text-[8px]">{formatToKSTWithTime(report.created_at) || "날짜 없음"}</p>
                    </div>
                    <p className="text-xs text-gray-700 mt-1 line-clamp-2">{report.content || "설명이 없습니다."}</p>
                </div>
            </div>
            <button className="absolute top-0 right-[10px] text-gray-500" onClick={() => handleClose(null)}>×</button>
        </div>
    );
}
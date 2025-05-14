import Link from "next/link";

type Report = {
    id?: string;
    type: string;
    report_lat: number;
    report_lng: number;
    distance_m?: number | null;
    title?: string;
    category?: string;
    media_urls?: string[];
    created_at?: string;
    content?: string;
    user_id?: string;
};

export default function Preview({ report }: { report: Report }) {
    return (
        <div className="bg-white h-[229px] rounded-2xl shadow-lg pointer-events-auto p-4 max-w-md mx-auto drop-shadow-[0_0px_6px_rgba(0,0,0,0.15)]">
            <div className="flex gap-4">
                <Link href={`/home/${report.id}`} className="w-1/2 h-full rounded-xl object-cover cursor-pointer">
                    <img
                        src={report.media_urls?.[0] || "/placeholder.png"}
                        alt="썸네일"
                        className="w-full h-full rounded-xl object-cover"
                    />
                </Link>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <img
                            src={"/img/mypage.png"}
                            alt="프로필"
                            className="w-[30px] h-[30px] rounded-full object-cover"
                        />
                        <p className="text-sm font-semibold">{report.user_id || "익명"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{report.category || "기타"} | {report.title}</p>
                        <p className="text-xs text-gray-400">{report.created_at || "날짜 없음"}</p>
                    </div>
                    <p className="text-xs text-gray-700 mt-1 line-clamp-2">{report.content || "설명이 없습니다."}</p>
                </div>
            </div>
        </div>
    );
}
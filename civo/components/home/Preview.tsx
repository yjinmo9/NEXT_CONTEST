import Link from "next/link";
import reportImg from '@/src/img/reporter.png';
import Image from "next/image";

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

export default function Preview({ report, handleClose }: { report: Report, handleClose: (report:null) => void }) {
    const userName = report.user_id || "익명";
    return (
        <div className="bg-white max-h-[228px] overflow-hidden rounded-2xl shadow-lg pointer-events-auto max-w-md mx-auto drop-shadow-[0_0px_6px_rgba(0,0,0,0.15)]">
            <div className="flex">
                <Link
                    href={`/home/${report.id}`}
                    className="w-[50vh] aspect-[3/4] h-full overflow-hidden rounded-l-xl cursor-pointer"
                >
                    <img
                        src={report.media_url || "/placeholder.png"}
                        alt="썸네일"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="flex gap-[4px] absolute bottom-[10px] left-[80px] justify-center items-center">
                    <Image
                        src={reportImg}
                        alt="신고 아이콘"
                        width={10}
                        height={10}
                        className="h-[10px] opacity-100"/>
                    <div className="text-white text-[11px] font-semibold">{userName}</div>
                    {/*여기 조회수*/}
                    </div>

                </Link>
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={"/img/mypage.png"}
                            alt="프로필"
                            className="w-[30px] h-[30px] rounded-full object-cover"
                        />
                        <p className="text-sm font-semibold">{report.user_id || "익명"}</p>
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
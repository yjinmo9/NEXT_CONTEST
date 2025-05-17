import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { formatToKST } from '@/utils/utils';
import Link from "next/link";

type Report = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    media_urls: string;
    type: string;
}


export default function Latest() {
    const [latestReport, setLatestReport] = useState<Report | null>(null);

    useEffect(() => {
        const fetchLatestReport = async () => {
            const res = await fetch("/api/report/latest");
            if (!res.ok) {
                throw new Error("Failed to fetch latest report");
            }
            const data = await res.json();
            setLatestReport(data.latest);
        };

        // 최초 요청
        fetchLatestReport();

        // 일정 주기마다 갱신
        const interval = setInterval(fetchLatestReport, 5000); // 5초마다

        // cleanup
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='bg-white h-[84px] p-[10px] overflow-hidden rounded-2xl shadow-lg pointer-events-auto max-w-md drop-shadow-[0_0px_6px_rgba(0,0,0,0.15)]'>
            <Link href={`/home/reportList/?id=${latestReport?.id}`} className='flex'>
                <div className='bg-gray-200 rounded-[10px] aspect-square w-[64px] h-[64px] flex items-center justify-center'>
                    {latestReport?.media_urls && (
                        <Image src={latestReport.media_urls[0]} alt="썸네일" width={64} height={64} className='object-cover rounded-[10px] aspect-square'/>
                    )}
                </div>
                <div className='flex flex-col justify-between h-full px-[10px] gap-[4px]'>
                    <div className='text-[15px]'>{latestReport?.title}</div>
                    <div className='text-[12px] text-[#939393]'>{formatToKST(latestReport?.created_at || "")}</div>
                </div>
            </Link>
        </div>
    );
};

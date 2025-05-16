'use client';

import { useEffect, useRef, useState, useCallback, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ClientReportDetail from './ClientReportDetail';


export default function ReportFeedPage() {
    const searchParams = useSearchParams();
    const targetIdFromUrl = searchParams.get('id'); // 👈 URL에서 id 추출

    const [reports, setReports] = useState<string[]>([]);

    const reportRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const loaderRef = useRef<HTMLDivElement | null>(null);


    async function fetchReport() {
        const res = await fetch(`/api/home/${targetIdFromUrl}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "알 수 없는 오류");
        }
        console.log('📦 로드된 신고글:', data);
        setReports((prev) => Array.from(new Set([...prev, data.id])));
        return data;
    }

    const loadMoreReports = useCallback(async () => {

        const report = await fetchReport();

        const lat = report?.report_lat || report?.missing_lat;
        const lng = report?.report_lng || report?.missing_lng;  

        console.log('📦 로드된 신고글:', report);

        const res = await fetch(`/api/report/nearby-reports?lat=${lat}&lng=${lng}`);
        const ids: string[] = await res.json();

        console.log('📦 로드된 ID들:', ids);

        setReports((prev) => Array.from(new Set([...prev, ...ids])));
    }, []);

    // ✅ 자동 스크롤 (렌더 후)
    useEffect(() => {
        if (targetIdFromUrl && reportRefs.current[targetIdFromUrl]) {
            const targetEl = reportRefs.current[targetIdFromUrl];
            targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [reports, targetIdFromUrl]);

    // ✅ IntersectionObserver로 자동 로딩
    useEffect(() => {
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreReports();
                }
            },
            { threshold: 1 }
        );
        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loadMoreReports]);

    return (
        <div className="w-full z-30 bg-white min-h-screen py-4 max-w-md mx-auto">
            <h1 className="px-5 text-[15px] font-semibold mb-2">실시간 주요 게시물</h1>
            {reports.map((id) => (
                <div
                    key={id}
                    data-id={id}
                    ref={(el) => { reportRefs.current[id] = el }}
                >
                    <ClientReportDetail id={id} />
                </div>
            ))}

            <div ref={loaderRef} className="py-8 text-center text-gray-400">
                불러오는 중...
            </div>
        </div>
    );
}

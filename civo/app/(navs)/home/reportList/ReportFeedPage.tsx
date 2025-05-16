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

    const [noNewReports, setNoNewReports] = useState(false);

    const [radius, setRadius] = useState<number>(100);
    const [length, setLength] = useState<number>(6);

    async function fetchReport() {
        const res = await fetch(`/api/home/reportGet?id=${targetIdFromUrl}`);
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

        const res = await fetch(`/api/report/nearby-reports?lat=${lat}&lng=${lng}&radius=${radius}&length=${length}`);
        const response = await res.json();
        const ids = response.data.result;
        const resultRadius = response.data.radius;
        const resultLength = response.data.result.length;

        console.log('📦 로드된 반경:', resultRadius);
        console.log('📦 로드된 길이:', resultLength);

        setRadius(resultRadius);
        setLength(resultLength+3);
        console.log('📦 로드된 ID들:', ids);

        // ✅ 중복 확인
        setReports((prev) => {
            const uniqueNewIds = ids.filter((id:string) => !prev.includes(id));
            const newState = Array.from(new Set([...prev, ...uniqueNewIds]));

            // ✅ 모든 아이디가 중복일 경우
            if (uniqueNewIds.length === 0) {
                setNoNewReports(true);
            } else {
                setNoNewReports(false);
            }

            return newState;
        });
    }, [radius, length]);

    // ✅ IntersectionObserver로 자동 로딩
    useEffect(() => {
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreReports();
                }
            },
            { 
                threshold: 1,
                rootMargin: '400% 0px'
             }
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
            {noNewReports && (
                <div className="py-4 text-center text-gray-400">
                    더 이상 게시물이 없습니다.
                </div>
            )}
        </div>
    );
}

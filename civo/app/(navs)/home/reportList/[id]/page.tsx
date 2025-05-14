'use client';

import { use, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ClientReportDetail from '../ClientReportDetail';

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const router = useRouter();
  const [reports, setReports] = useState<string[]>([id]);
  const [activeId, setActiveId] = useState(id);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRefs = useRef<Record<string, IntersectionObserver>>({});
  const reportRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function fetchReport() {
    const res = await fetch(`/api/home/${id}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "알 수 없는 오류");
    }

    return data;
  }

  const fetchNextReportId = async () => {
    const currentReport = await fetchReport();
    console.log("📦 현재 게시물:", currentReport);

    const nearbyRes = await fetch(`/api/report/nearby-reports?lat=${currentReport.report_lat||currentReport.missing_lat}&lng=${currentReport.report_lng||currentReport.missing_lng}`);
    const nearby = await nearbyRes.json();


    if (!nearbyRes.ok) {
      console.error("❌ nearby API 실패:", nearby.error);
      return;
    }

    if (!Array.isArray(nearby)) {
      console.error("❌ 응답값이 배열이 아님:", nearby);
      return;
    }
    const newIds = nearby.filter((newId: string) => !reports.includes(newId));
    
    console.log("📦 새로 발견된 게시물 ID:", newIds);

    if (newIds.length === 0) {
      setHasMore(false);
      return;
    }

    setReports((prev) => [...prev, ...newIds]);
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await fetchNextReportId();
    setLoading(false);
  }, [loading, hasMore]);

  // 👉 뷰포트에 들어온 게시물 ID 추적
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id');
          if (entry.isIntersecting && id && id !== activeId) {
            setActiveId(id);
            router.replace(`/home/reportList/${id}`);

          }
        });
      },
      { threshold: 0.6 }
    );

    reports.forEach((id) => {
      const ref = reportRefs.current[id];
      if (ref && !observerRefs.current[id]) {
        observer.observe(ref);
        observerRefs.current[id] = observer;
      }
    });

    return () => observer.disconnect();
  }, [reports, activeId, router]);

  // 👉 마지막 게시물이 보이면 다음 로딩
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <div className="w-full z-30 bg-white min-h-screen py-4 max-w-md mx-auto">
      <h1 className="px-5 text-[15px] font-semibold mb-2">실시간 주요 게시물</h1>

      {reports.map((id) => (
        <div
          key={id}
          data-id={id}
          ref={(el) => {
            reportRefs.current[id] = el;
          }}
        >
          <ClientReportDetail id={id} />
        </div>
      ))}

      {hasMore && (
        <div ref={loaderRef} className="py-4 text-center text-gray-400">
          다음 게시물 불러오는 중...
        </div>
      )}

      {!hasMore && (
        <div className="py-4 text-center text-gray-400">
          더 이상 게시물이 없습니다.
        </div>
      )}
    </div>
  );
}

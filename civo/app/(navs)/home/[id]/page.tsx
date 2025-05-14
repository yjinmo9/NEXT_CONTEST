'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientReportDetail from './ClientReportDetail';

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params);

  const router = useRouter();
  const [reports, setReports] = useState<string[]>([id]);
  const [activeId, setActiveId] = useState(id);
  const [loading, setLoading] = useState(false);
  const observerRefs = useRef<Record<string, IntersectionObserver>>({});
  const reportRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchNextReportId = async () => {
    // 여기에 다음 게시물 ID를 가져오는 로직을 추가하세요.
    return ""
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id');
          if (entry.isIntersecting && id && id !== activeId) {
            setActiveId(id);
            router.replace(`/home/${id}`); // ✅ URL 동기화
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

  const loadMore = async () => {
    setLoading(true);
    const nextId = await fetchNextReportId();
    setReports((prev) => [...prev, nextId]);
    setLoading(false);
  };

  return (
    <div className="w-full z-30 bg-white min-h-screen py-4 max-w-md mx-auto">
      <h1 className="px-5 text-[15px] font-semibold mb-2">실시간 주요 게시물</h1>
      {reports.map((id) => (
        <div
          key={id}
          data-id={id}
          ref={(el) => {reportRefs.current[id] = el}}
        >
          <ClientReportDetail id={id} />
        </div>
      ))}
      <button
        onClick={loadMore}
        className="w-full py-2 mt-4 bg-gray-200 text-sm"
      >
        다음 게시물 불러오기
      </button>
    </div>
  );
}


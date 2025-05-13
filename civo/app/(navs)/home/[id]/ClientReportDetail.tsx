"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type Report = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  category: string;
  user_id?: string;
  media_urls?: string[];
  type: string;
  distance_m?: number;
};

export default function ClientReportDetail({ id }: { id: string }) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/home/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "알 수 없는 오류");
        }

        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  if (loading) return <p className="p-4">로딩 중...</p>;
  if (error) return <p className="p-4 text-red-500">❌ {error}</p>;
  if (!report) return <p className="p-4">데이터가 없습니다.</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-2">{report.title}</h1>
      <p className="text-sm text-gray-500">{report.created_at}</p>
      <p className="text-sm text-gray-600 mb-4">{report.category}</p>

      {report.media_urls?.[0] && (
        <img
          src={report.media_urls[0]}
          alt="미디어"
          className="w-full h-auto rounded-lg mb-4 object-cover"
        />
      )}

      <p className="text-base text-gray-800 whitespace-pre-wrap">{report.content}</p>

      <div className="mt-6">
        <button
          onClick={() => router.push("/home")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}

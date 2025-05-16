"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatToKSTWithTime } from "@/utils/utils";

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
  report_lat: number;
  report_lng: number;
  missing_lat?: number;
  missing_lng?: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_image: string;
};

export default function ClientReportDetail({ id }: { id: string }) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/home/reportGet?id=${id}`);
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

    async function fetchUserData(userId: string) {
      const userRes = await fetch(`/api/user?uid=${userId}`);
      if (!userRes.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userRes.json();
      console.log("🔥 userData:", userData);
      if (!userData) {
        throw new Error("User data not found");
      }
      setUser(userData?? null);
    }

    fetchReport();
    fetchUserData(report?.user_id || "")
  }, [id, report?.user_id]);

  if (error) return <p className="p-4 text-red-500"></p>;
  if (!report) return <p className="p-4">데이터가 없습니다.</p>;

  return (
    <div className="w-full min-h-screen mx-auto">
      {report.media_urls?.[0] && (
        <img
          src={report.media_urls[0]}
          alt="미디어"
          className="aspect-[3/4] w-full h-auto mb-4 object-cover"
        />
      )}
      <div className="flex flex-col px-4">
      <div className="flex items-center gap-2 mb-4">
        <img
          src={user?.profile_image || "/img/mypage.png"}
          alt="프로필"
          className="w-[30px] h-[30px] rounded-full object-cover"
        />
        <p className="text-sm font-semibold">{user?.name || "익명"}</p>
      </div>
      <div className="font-semibold text-[17px]">{report.title}</div>
      <div className="text-[12px] text-gray-400 mb-2">{formatToKSTWithTime(report.created_at) || "날짜 없음"}</div>
      <p className="text-[13px] whitespace-pre-wrap">{report.content}</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatToKSTWithTime } from "@/utils/utils";
import { ThumbsUp, ThumbsDown } from 'lucide-react';

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
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [vote, setVote] = useState<null | 'like' | 'dislike'>(null);

  const handleLike = async () => {
    if (vote === 'like') {
      setLikes(likes - 1);
      setVote(null);
    } else {
      setLikes(likes + 1);
      if (vote === 'dislike') setDislikes(dislikes - 1);
      setVote('like');
      await fetch("/api/home/like-report", {
        method: "POST",
        body: JSON.stringify({ reportId: id }),
        headers: { "Content-Type": "application/json" },
      });

    }
  };

  const handleDislike = async () => {
    if (vote === 'dislike') {
      setDislikes(dislikes - 1);
      setVote(null);
    } else {
      setDislikes(dislikes + 1);
      if (vote === 'like') setLikes(likes - 1);
      setVote('dislike');
      await fetch("/api/home/dislike-report", {
        method: "POST",
        body: JSON.stringify({ reportId: id }),
        headers: { "Content-Type": "application/json" },
      });

    }
  };
  
  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/home/reportGet?id=${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "알 수 없는 오류");
        }

        setReport(data);
        setLikes(data.likes);
        if (data.alreadyLiked) {
          setVote('like');
        }

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
      setUser(userData ?? null);
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
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border ${vote === 'like' ? 'bg-blue-100 border-blue-400 text-blue-600' : 'border-gray-300 text-gray-600'}`}
          >
            <ThumbsUp size={16} /> {likes}
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border ${vote === 'dislike' ? 'bg-red-100 border-red-400 text-red-600' : 'border-gray-300 text-gray-600'}`}
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
} 
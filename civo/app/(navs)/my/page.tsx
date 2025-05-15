"use client";

import { ProfileSection } from "@/components/my/profile-section";
import { ReputationSection } from "@/components/my/reputation-section";
import { ReportSection } from "@/components/my/report-section";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { getUserIdAction } from "@/app/actions";

export default function MyPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [user_id, setUserId] = useState<string | null>(null);
  const [username, setUserName] = useState<string>("익명");
  const [profileImage, setProfileImage] = useState<string>();

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);

        const user_id = await getUserIdAction();
        setUserId(user_id || null);
        console.log("🔥 현재 사용자 ID:", user_id);

        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("user_id", user_id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ 제보 기록 불러오기 실패:", error.message);
          return;
        }

        console.log("🔥 ReportSection에 전달된 데이터:", reports);

        // ✅ 디버깅 로그: 데이터 존재 여부
        if (data && data.length > 0) {
          console.log("✅ 가져온 데이터:", data);
        } else {
          console.warn("⚠️ 데이터가 비어 있음", data);
        }

        setReports(data || []);
      } catch (err) {
        console.error("❌ 예외 발생:", err);
      } finally {
        setLoading(false);
      }
    } 
    async function fetchUserInfo() {
      const userId = await getUserIdAction();

      setUserId(userId || "익명"); // ✅ 여기서 바로 user.id 사용

      const res = await fetch(`/api/user/${userId}`)
      const data = await res.json();
      console.log("🔥 사용자 정보:", data);

      if (data) {
        setUserName(data.name);
        setProfileImage(data.profile_image);
      } else {
        console.warn("⚠️ 사용자 정보가 비어 있음");
      }
    }

    fetchReports();
    fetchUserInfo();
  }, [supabase]);

  return (
    <div className="w-full z-30 bg-white min-h-screen">
      <ProfileSection name={username || "이름이 없습니다."} profile={profileImage} />
      <ReputationSection />
      <ReportSection reports={reports} isLoading={loading} />
    </div>
  );
}

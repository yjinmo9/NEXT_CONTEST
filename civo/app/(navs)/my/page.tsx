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

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);

        const user_id = await getUserIdAction();
        setUserId(user_id);
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

    fetchReports();
  }, [supabase]);

  return (
    <div className="w-full z-30 bg-white min-h-screen">
      <ProfileSection name={user_id || "이름이 없습니다."}/>
      <ReputationSection />
      <ReportSection reports={reports} isLoading={loading} />
    </div>
  );
}

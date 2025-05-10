"use client";

import { ProfileSection } from "@/components/my/profile-section";
import { ReputationSection } from "@/components/my/reputation-section";
import { ReportSection } from "@/components/my/report-section";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function MyPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);

        // ✅ 하드코딩된 사용자 ID (테스트용)
        const user_id = "acd6115e-8c87-4b74-a9f4-311eeb7aa62e";

        // ✅ Supabase에서 해당 user_id의 제보 기록 조회
        const { data, error } = await supabase
          .from("reports")
          .select("*")
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
      <ProfileSection />
      <ReputationSection />
      <ReportSection reports={reports} isLoading={loading} />
    </div>
  );
}

import { ProfileSection } from "@/components/my/profile-section";
import { ReputationSection } from "@/components/my/reputation-section";
import { ReportSection } from "@/components/my/report-section";

export default function MyPage() {
  const reports = [
    {
      id: 1,
      title: "전장연, 혜화역 승강장 시위하다 강제퇴거... 서울 연속",
      created_at: "2025.04.26",
      image: null,
      status: 'pending' as const
    }
  ];

  return (
    <div className="w-full z-30 bg-white min-h-screen">
      <ProfileSection />
      <ReputationSection />
      <ReportSection reports={reports} />
    </div>
  );
}
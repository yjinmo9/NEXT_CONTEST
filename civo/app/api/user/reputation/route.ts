// app/api/user/reputation/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 등급 계산 함수
function getReportLevel(count: number): "Diamond" | "Gold" | "Silver" | "Bronze" | null {
  if (count >= 50) return "Diamond";
  if (count >= 30) return "Gold";
  if (count >= 15) return "Silver";
  if (count >= 1) return "Bronze";
  return null;
}

function getReportLevelScore(count: number): number {
  if (count >= 50) return 100;
  if (count >= 30) return 85;
  if (count >= 15) return 70;
  if (count >= 1) return 50;
  return 0;
}

// 검증 여부 판단 함수
function isVerified(type: string, distance_m: number | null): boolean {
  if (type === "missing") return true;
  if ((type === "incident" || type === "damage") && distance_m !== null) {
    return distance_m <= 100;
  }
  return false;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from("reports")
    .select("type, distance_m, likes, dislikes")
    .eq("user_id", userId);

  if (error) {
    console.error("🚨 Supabase 오류:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalReports = reports.length;

  const verifiedReports = reports.filter((r: { type: string; distance_m: number | null; }) =>
    isVerified(r.type, r.distance_m)
  ).length;

  const accuracy = totalReports === 0 ? 0 : verifiedReports / totalReports;

  const likes = reports.reduce((sum: any, r: { likes: any; }) => sum + (r.likes || 0), 0);
  const dislikes = reports.reduce((sum: any, r: { dislikes: any; }) => sum + (r.dislikes || 0), 0);
  const feedbackScore =
    likes + dislikes === 0 ? 0.5 : likes / (likes + dislikes);

  const reportLevel = getReportLevel(totalReports);
  const reportScore = getReportLevelScore(totalReports);

  const reputationScore = Math.round(
    accuracy * 100 * 0.4 + reportScore * 0.2 + feedbackScore * 100 * 0.4
  );

  // ✅ 디버깅 로그
  console.log("🧪 유저 ID:", userId);
  console.log("📦 제보 수:", totalReports);
  console.log("✅ 검증 통과 수:", verifiedReports);
  console.log("📊 정확도:", accuracy);
  console.log("👍:", likes, "👎:", dislikes, "➡️ 피드백:", feedbackScore);
  console.log("📈 등급:", reportLevel, "🏆 평판 점수:", reputationScore);

  return NextResponse.json({
    accuracy: parseFloat(accuracy.toFixed(2)),
    report_count: totalReports,
    report_level: reportLevel,
    feedback: {
      likes,
      dislikes,
      score: parseFloat(feedbackScore.toFixed(2)),
    },
    reputation_score: reputationScore,
  });
}

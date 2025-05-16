'use client';

import { useEffect, useState } from "react";
import  Tooltip from "./toolTip";

export function ReputationSection({ userId }: { userId: string }) {
  const [accuracy, setAccuracy] = useState<number>(0);
  const [reportCount, setReportCount] = useState<number>(0);
  const [reportLevel, setReportLevel] = useState<string>("");
  const [feedbackScore, setFeedbackScore] = useState<number>(0);
  const [reputationScore, setReputationScore] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState(false);

  function getLevelColor(level: string) {
    switch (level) {
      case "Diamond":
        return "bg-gradient-to-r from-cyan-400 to-blue-600"; // 반짝이는 느낌
      case "Gold":
        return "bg-yellow-400";
      case "Silver":
        return "bg-gray-400";
      case "Bronze":
        return "bg-amber-700";
      default:
        return "bg-gray-300";
    }
  }

  useEffect(() => {
    async function fetchReputation() {
      console.log("🔥 사용자 ID:", userId);

      const reputationData = await fetch(`/api/user/reputation?user_id=${userId}`);
      const reputation = await reputationData.json();

      if (reputation.error) {
        console.error("❌ 평판 점수 조회 실패:", reputation.error);
        return;
      }

      setAccuracy(reputation.accuracy);
      setReportCount(reputation.report_count);
      setReportLevel(reputation.report_level);
      setFeedbackScore(reputation.feedback.score);
      setReputationScore(reputation.reputation_score);
    }

    fetchReputation();
  }, [userId]);

  return (
    <div className="px-[20px] py-[16px] border-t border-[#EEEEEE]">
      <h2 className="text-[15px] font-semibold mb-[12px]">평판 점수</h2>

      <div className="flex items-center gap-[6px] mb-[16px] relative">
      <span className="text-[22px] font-bold">{reputationScore}점</span>
      <span
        className="text-[12px] text-gray-500 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        ℹ
        {showTooltip && (
          <Tooltip text={
            `[평판 점수 산정 기준]\n1. 정확도 (40%): 검증 통과 제보 / 전체 제보\n2. 제보 레벨 (20%): 총 제보 수에 따른 등급\n3. 사용자 피드백 (40%): 좋아요 수 / 전체 반응`
          } />
        )}
      </span>
    </div>
      <div className="space-y-[8px]">
        {/* 정확도 */}
        <div>
          <p className="text-[13px] mb-[4px]">소식 정확도 {accuracy}%</p>
          <div className="w-full h-[6px] bg-gray-200 rounded-full">
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* 제보 횟수 + 레벨 */}
        <div>
          <p className="text-[13px] mb-[4px]">
            제보 횟수 {reportCount}회{" "}
            <span className="text-gray-500 ml-2">
              ({reportLevel})
            </span>
          </p>
          <div className="w-full h-[6px] bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${getLevelColor(reportLevel)}`}
              style={{ width: `${Math.min(reportCount, 100)}%` }}
            />
          </div>
        </div>

        {/* 피드백 */}
        <div>
          <p className="text-[13px] mb-[4px]">사용자 피드백 {feedbackScore}%</p>
          <div className="w-full h-[6px] bg-gray-200 rounded-full">
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{ width: `${feedbackScore}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

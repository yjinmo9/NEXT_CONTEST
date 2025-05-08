'use client'

export function ReputationSection() {
  return (
    <div className="px-[20px] py-[16px] border-t border-[#EEEEEE]">
      <h2 className="text-[15px] font-semibold mb-[12px]">평판 점수</h2>
      <div className="flex items-center gap-[6px] mb-[16px]">
        <span className="text-[22px] font-bold">85점</span>
        <span className="text-[12px] text-gray-500">ℹ️</span>
      </div>
      <div className="space-y-[8px]">
        <div>
          <p className="text-[13px] mb-[4px]">소식 정확도</p>
          <div className="h-[6px] bg-black rounded-full w-[90%]" />
        </div>
        <div>
          <p className="text-[13px] mb-[4px]">제보 횟수</p>
          <div className="h-[6px] bg-gray-200 rounded-full w-[40%]" />
        </div>
        <div>
          <p className="text-[13px] mb-[4px]">사용자 피드백</p>
          <div className="h-[6px] bg-black rounded-full w-[80%]" />
        </div>
      </div>
    </div>
  );
}
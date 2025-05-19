'use client'

import Image from "next/image";
import { formatToKST } from "@/utils/utils";

interface Report {
  source: string;
  id: number | string;
  title: string;
  type: string
  created_at: string;
  image: string;
}

interface ReportSectionProps {
  reports: Report[];
  isLoading: boolean; // ✅ 추가
  px?: string
}

export function ReportSection({ reports, isLoading, px }: ReportSectionProps) {
  return (
    <div className={`px-[${px ? px : '20px'}] py-[16px]`}>

      {/* ✅ 로딩 중 표시 */}
      {isLoading ? (
        <p className="text-[14px] text-gray-500 text-center py-[20px]">로딩 중...</p>
      ) : (
        <div className="space-y-[12px]">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="flex gap-[10px]">
                <div className="relative w-[70px] h-[70px] bg-gray-200 rounded-[6px] overflow-hidden shrink-0">
                  {report.image && (
                    <Image
                      src={report.image}
                      alt="제보 이미지"
                      fill
                      className="object-cover rounded-[6px]"
                    />
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="text-[14px] font-medium leading-tight line-clamp-2">
                    {report.title}
                  </div>
                  <p className="text-[12px] text-gray-500 mt-[2px]">
                    {formatToKST(report.created_at)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[14px] text-gray-500 text-center py-[20px]">
              알림이 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

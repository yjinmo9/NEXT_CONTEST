'use client'

import Image from "next/image";

interface Report {
  id: number;
  title: string;
  created_at: string;
  image: string | null;
  status: 'pending' | 'completed';
}

interface ReportSectionProps {
  reports: Report[];
}

export function ReportSection({ reports }: ReportSectionProps) {
  return (
    <div className="px-[20px] py-[16px] border-t border-[#EEEEEE]">
      <h2 className="text-[15px] font-semibold mb-[12px]">내 제보 기록</h2>
      <div className="space-y-[12px]">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="flex gap-[10px]">
              <div className="w-[70px] h-[70px] bg-gray-200 rounded-[6px]">
                {report.image && (
                  <Image 
                    src={report.image} 
                    alt="제보 이미지" 
                    width={70} 
                    height={70} 
                    className="rounded-[6px] object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-[14px] font-medium">{report.title}</h3>
                <p className="text-[12px] text-gray-500 mt-[2px]">{report.created_at}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[14px] text-gray-500 text-center py-[20px]">
            아직 제보 기록이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
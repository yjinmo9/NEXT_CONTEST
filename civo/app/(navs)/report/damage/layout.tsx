'use client';

import { DamageFormProvider } from '@/app/context/DamageFormContext';
import { StepIndicator } from '@/components/ui/SteopIndicator';
import { usePathname } from "next/navigation";

export default function ReportLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const current = pathname.endsWith("2") ? 2 : 1;

  return (
    <DamageFormProvider>
      <div className="w-full px-[20px] z-20 bg-white min-h-screen pointer-events-auto flex flex-col gap-[10px]">
        <span className="px-[2px] text-[15px] font-semibold">기물 파손 신고하기</span>
        <p className="text-[34px] leading-tight">
          <span className="font-bold">기물파손 정보</span>를<br />
          알려주세요
        </p>
        <StepIndicator current={current} />
        {children}
      </div>
    </DamageFormProvider>
  );
}

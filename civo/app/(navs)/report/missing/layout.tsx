'use client';

import { StepIndicator } from '@/components/ui/SteopIndicator';
import { usePathname } from "next/navigation";
import { MissingFormProvider } from '@/app/context/MissingFormContext';

export default function MissingtLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const current = pathname.endsWith("2") ? 2 : 1;

  return (
    <MissingFormProvider>
      <div className="w-full px-[20px] z-20 bg-white min-h-screen pointer-events-auto flex flex-col gap-[10px]">
        <span className="px-[2px] text-[15px] font-semibold">실종자 신고하기</span>
        <p className="text-[34px] leading-tight">
          <span className="font-bold">실종자 정보</span>를<br />
          알려주세요
        </p>
        <StepIndicator current={current} />
        {children}
      </div>
    </MissingFormProvider>
  );
}

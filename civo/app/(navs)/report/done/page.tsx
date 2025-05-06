'use client';

import Image from "next/image"
import ReportDone from "@/src/img/reportDone.png"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DonePage() {
    const router = useRouter();

    useEffect(() => {
      const timer = setTimeout(() => {
        router.push('/report');
      }, 1500);
  
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 정리
    }, [router]);
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] text-center gap-[34px]">
            <Image src={ReportDone} alt="제보완료" />
            <p>제보가 접수 되었습니다.</p>
            <p>기본적인 확인절차 후에 제보가 업로드 됩니다.<br/>확인 후 무통보 삭제될 수 있습니다.</p>
        </div>
    )
}
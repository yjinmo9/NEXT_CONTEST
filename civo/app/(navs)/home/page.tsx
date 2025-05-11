'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Navermap from "@/components/home/navermap";
import searchGlyphImg from '@/src/img/Search Glyph.png';

export default function HomePage() {
  const [reports, setReports] = useState<any[]>([]);

  // ✅ 최초 렌더링 시 API 호출
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/home'); // ← 여기가 /app/api/home/route.ts 실행
        const data = await res.json();
        setReports(data.reports || []);
        console.log('✅ 가져온 reports:', data.reports);
      } catch (err) {
        console.error('❌ 지도 제보 불러오기 실패:', err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className='relative w-full h-full overflow-hidden px-[20px] z-20'> 
      {/* 🗺️ 지도 컴포넌트에 reports 전달 */}
      <div className="fixed inset-0 z-0">
        <Navermap reports={reports} />
      </div>

      {/* 🔍 검색창 */}
      <div id="searchfield" className="mt-[20px] pt-[8px] pb-[7px] pl-[8px] pr-[8px] h-[36px] w-full z-20 bg-white rounded-[10px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] flex gap-[8px] pointer-events-auto">
        <Image src={searchGlyphImg} alt="돋보기" width={21} height={19}/>
        <input placeholder='지역/사건 검색하기' className='w-full text-[13px]'/>
      </div>
    </div>
  );
}

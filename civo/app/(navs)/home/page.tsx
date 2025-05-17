'use client';

import Image from 'next/image';
import Navermap from "@/components/home/navermap";
import searchGlyphImg from '@/src/img/Search Glyph.png';
import Latest from '@/components/home/Latest';

export default function HomePage() {
  return (
    <div className='relative w-full h-full overflow-hidden px-[20px] z-20'>
      {/* 🗺️ 지도 컴포넌트에 reports 전달 */}
      <div className="fixed inset-0 z-0">
        <Navermap />
      </div>

      {/* 🔍 검색창 */}
      <div id="searchfield" className="mt-[20px] pt-[8px] pb-[7px] pl-[8px] pr-[8px] h-[36px] w-full z-20 bg-white rounded-[10px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] flex gap-[8px] pointer-events-auto">
        <Image src={searchGlyphImg} alt="돋보기" width={21} height={19} />
        <input placeholder='지역/사건 검색하기' className='w-full text-[13px]' />
      </div>

      {/* 최신 이슈글 */}
      <div className="fixed bottom-[12vh] inset-x-0 z-50 px-4 pb-4 pointer-events-none">
        <Latest />
      </div>
    </div>
  );
}

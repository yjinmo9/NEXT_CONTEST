'use client';

import { usePathname } from "next/navigation";
import Image from 'next/image';
import Home from '@/src/img/home.png'
import HomeSelected from '@/src/img/homeSelected.png'
import News from '@/src/img/news.png'
import NewsSelected from '@/src/img/newsSelected.png'
import Report from '@/src/img/report.png'
import ReportSelected from '@/src/img/reportSelected.png'
import Mypage from '@/src/img/mypage.png'
import MypageSelected from '@/src/img/mySelected.png'
import Link from "next/link";

export default function Footer() {
    const pathname = usePathname();

    return (
      <footer className="fixed bottom-0 h-[89px] w-full pb-[15px] pt-[9px] bg-white flex rounded-t-2xl items-center justify-around drop-shadow-[0_0px_6px_rgba(0,0,0,0.15)] z-10">
        <Link className={`flex flex-1 flex-col items-center justify-center gap-[3px] ${pathname.startsWith('/home') ? 'text-black' : 'text-gray-400'}`} href={'/home'}>
          <Image src={pathname.startsWith('/home')?HomeSelected:Home} alt="메인" width={21} height={19} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link className={`flex flex-1 flex-col items-center justify-center gap-[3px] ${pathname.startsWith('/news') ? 'text-black' : 'text-gray-400'}`} href={'/news'}>
          <Image src={pathname.startsWith('/news')?NewsSelected:News} alt="뉴스" width={21} height={19} />
          <span className="text-[10px]">News</span>
        </Link>
        <Link className={`flex flex-1 flex-col items-center justify-center gap-[3px] ${pathname.startsWith('/report') ? 'text-black' : 'text-gray-400'}`} href={'/report'}>
          <Image src={pathname.startsWith('/report')?ReportSelected:Report} alt="보고" width={21} height={19} />
          <span className="text-[10px]">Report</span>
        </Link>
        <Link className={`flex flex-1 flex-col items-center justify-center gap-[3px] ${pathname.startsWith('/my') ? 'text-black' : 'text-gray-400'}`} href={'/my'}>
          <Image src={pathname.startsWith('/my')?MypageSelected:Mypage} alt="내 정보" width={21} height={19} />
          <span className="text-[10px]">My</span>
        </Link>
    </footer>
    )
}
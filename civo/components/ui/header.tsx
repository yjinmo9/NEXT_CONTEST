'use client'

import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image';
import Logo from '@/src/img/logo.png'
import Help from '@/src/img/help.png'
import Notice from '@/src/img/notice.png'
import path from "path";
import Link from "next/link";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter()

    return (
    <header className={`fixed h-[92.65px] top-0 w-full pt-[4px] pb-[4px] z-50 bg-white ${pathname==='/home'?'drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]':''} ${pathname==='/splash1'||pathname==='/splash2'?'hidden':''}`}>
    <div className="mt-[54.65px] text-[23.12px] flex">
      <button className="absolute mt-[8px] pl-[20px]" onClick={() => router.back()}>
        <Image src='/img/backButton.png' alt="뒤로가기" width={10} height={18} />
      </button>
      <div className="mx-auto flex items-center gap-[8px]">
        <Image src={Logo} alt="로고" width={21} height={19} className="mt-[7px] mb-[7px]"/>
        <div>CIVO</div>
      </div>
      {pathname==='/home'?(
      <div className="absolute pt-[7px] right-0 mr-[10px] flex gap-[8px]">
        <Image src={Help} alt="도움말" width={21} height={19} />
        <Link href='/notifications'>
        <Image src={Notice} alt="소식" width={21} height={19} />
        </Link>
      </div>):(
        <Link href={'/notifications'}>
        <Image src={Notice} alt="소식" width={21} height={19} className="absolute pt-[7px] right-0 mr-[10px]"/>
        </Link>
      )
      }
    </div>
  </header>
    )
}
'use client'

import { usePathname } from "next/navigation";
import Image from 'next/image';
import Logo from '@/src/img/logo.png'
import Help from '@/src/img/help.png'
import Notice from '@/src/img/notice.png'

export default function Header() {
    const pathname = usePathname();

    return (
    <header className={`fixed top-0 w-full pt-[4px] pb-[4px] z-50 bg-white ${pathname==='/home'?'drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]':''}`}>
    <div className="mt-[54.65px] w-full text-[23.12px] flex items-center gap-[10px]">
      <Image src={Logo} alt="로고" width={21} height={19} className="ml-[158.37px] mt-[7px] mb-[7px]"/>
      <div className="flex items-center">CIVO</div>
      {pathname==='/home'?(
      <div className="ml-[70px] flex gap-[8px]">
        <Image src={Help} alt="도움말" width={21} height={19} />
        <Image src={Notice} alt="소식" width={21} height={19} />
      </div>):(
        <Image src={Notice} alt="소식" width={21} height={19} className="ml-[99px]"/>
      )
      }
    </div>
  </header>
    )
}
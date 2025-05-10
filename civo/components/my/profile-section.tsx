'use client'

import Image from "next/image";



export function ProfileSection() {
  return (
    <div className="px-[20px] py-[16px]">
      <h1 className="text-[15px] font-semibold mb-[12px]">내 정보</h1>
      <div className="flex items-center gap-[10px]">
        <div className="relative w-[50px] h-[50px]">
          <Image 
            src="/img/help.png"  
            alt="프로필" 
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div>
          <p className="text-[15px] font-medium">양진모</p>
          <button className="text-[13px] text-gray-500 mt-[2px]">
            프로필 수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
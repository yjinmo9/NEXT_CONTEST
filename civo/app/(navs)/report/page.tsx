import Image from "next/image";
import Report01 from "@/src/img/reportImg1.jpg"
import Report02 from "@/src/img/reportImg2.jpg"
import Report03 from "@/src/img/reportimg3.jpg"
import Link from "next/link";

export default function ReportPage() {          
    return(
        <div className="w-full h-full px-[20px] z-20 bg-white pointer-events-auto flex flex-col gap-[10px] shrink-0">
            <span className="px-[2px] text-[15px] font-semibold">제보 하기</span>
            <span className="font-bold text-[22px]">무슨 일이 일어나고 있나요?</span>
            <p className="text-[11px] font-normal text-description">
                정확한 사건 제보는 시민들의 안전에 도움이 됩니다.<br/>
                허위로 신고하실 경우 '허위사실 유포'에 의해 처벌 받을 수 있습니다.
            </p>
            
            <div id="list" className="flex-grow min-h-0 overflow-y-auto flex flex-col gap-[10px]">
            <Link href="/report/incident" scroll={true} className="relative mt-[10px] h-[235px] px-[18px] py-[11px] w-full text-right text-white">
                <Image src={Report01} fill alt="사고 제보" className="rounded-[10px] object-cover"/>
                <div className="absolute bottom-3 right-3 text-right z-10">
                    <p className="font-semibold text-[15px]">사고 제보</p>
                    <p className="text-[10px]">교통사고 · 화재 · 인구 밀집</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 z-0 rounded-[10px]" />
            </Link>
            <Link href="/report/damage/1" scroll={true}className="relative h-[140px] px-[18px] py-[11px] w-full text-right text-white">
                <Image src={Report02} fill alt="기물파손 제보" className="rounded-[10px] object-cover"/>
                <div className="absolute bottom-3 right-3 text-right z-10">
                    <p className="font-semibold text-[15px]">기물 파손 제보</p>
                    <p className="text-[10px]">도로시설물 파손안전 · 위험물 등</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 z-0 rounded-[10px]" />
            </Link>
            <Link href="/report/missing/1" className="relative h-[140px] px-[18px] py-[11px] w-full text-right text-white">
                <Image src={Report03} fill alt="기물파손 제보" className="rounded-[10px] object-cover"/>
                <div className="absolute bottom-3 right-3 text-right z-10">
                    <p className="font-semibold text-[15px]">실종 제보</p>
                    <p className="text-[10px]">노약자 실종신고 · 반려동물 실종</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-30 z-0 rounded-[10px]" />
            </Link>
            </div>
            <div className="h-[100px]"/>
        </div>
    )
}
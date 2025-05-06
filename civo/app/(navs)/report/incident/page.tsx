import ReportInput from "@/components/report/report";

export default function incidentReport() {
    return(
        <div className="w-full px-[20px] z-20 bg-white min-h-screen pointer-events-auto flex flex-col gap-[10px]">
            <span className="px-[2px] text-[15px] font-semibold">사고 제보하기</span>
            <p className="text-[34px] leading-tight"><span className="font-bold">사고 정보</span>를<br/> 알려주세요</p>
            <ReportInput />
        </div>
    )
}
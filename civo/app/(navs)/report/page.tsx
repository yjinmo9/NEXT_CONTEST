import ReportInput from "@/components/report/report";

export default function ReportPage() {
    return(
        <div className="w-full px-[20px] z-20 bg-white min-h-screen pointer-events-auto flex flex-col">
            <span className="pt-[8px] pb-[8px] text-[15px] font-semibold">제보 하기</span>
            <span className="font-bold text-[22px]">무슨 일이 일어나고 있나요?</span>
            <ReportInput/>
        </div>       
    )
}
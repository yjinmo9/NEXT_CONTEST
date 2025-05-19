"use client";

import { ReportSection } from "@/components/my/report-section";
import { useEffect, useState } from "react";

export default function Notification() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReports() {
            try {
                const res = await fetch('/api/notifications')
                const data = await res.json()

                setReports(data.notifications || []);
            } catch (err) {
                console.error("❌ 예외 발생:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchReports()
    }, [])
        return (
            <div className="w-full px-[20px] z-20 bg-white min-h-screen pointer-events-auto flex flex-col gap-[10px]">
                <span className="px-[2px] text-[15px] font-semibold">알림 센터</span>
                <p className="text-[22px] leading-tight"><span className="font-bold">알림</span></p>
                <p className="text-[11px] font-normal text-description">
                    정확하지 않은 제보는 승인 이후 무통보 삭제될 수 있습니다.<br/>
                    최신 소식과 뉴스를 선별하여 5개 제공합니다.
                </p>
                <ReportSection reports={reports} isLoading={loading} px="0" />
            </div>
        )
    }
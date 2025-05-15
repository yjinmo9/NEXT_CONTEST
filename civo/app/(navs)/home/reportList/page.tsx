import { Suspense } from "react";
import ReportFeedPage from "./ReportFeedPage";

export default function ReportPage() {
    return (<Suspense fallback={<div>불러오는중...</div>}>
        <ReportFeedPage />
    </Suspense>); // Suspense로 감싸서 로딩 상태를 처리합니다.
}
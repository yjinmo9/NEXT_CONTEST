'use client';

import { useEffect } from "react";
import MissingFormStep2 from "@/components/report/inputs/MissingFormStep2";

export default function DanmageReport2() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
        <MissingFormStep2/>
    )
}
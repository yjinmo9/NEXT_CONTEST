'use client';

import { useEffect } from "react";
import DamageFormStep2 from "@/components/report/inputs/DamageFormStep2";

export default function DanmageReport2() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
            <DamageFormStep2 />
    )
}
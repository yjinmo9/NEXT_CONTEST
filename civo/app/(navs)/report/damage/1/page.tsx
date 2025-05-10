'use client';

import { useEffect } from "react";
import DamageFormStep1 from "@/components/report/inputs/DamageFormStep1";

export default function DanmageReport1() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
            <DamageFormStep1 />
    )
}
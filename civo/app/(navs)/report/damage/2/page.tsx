'use client';

import { useEffect } from "react";
import DamageInput2 from "@/components/report/Inputs/DamageInput2";

export default function DanmageReport2() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
            <DamageInput2 />
    )
}
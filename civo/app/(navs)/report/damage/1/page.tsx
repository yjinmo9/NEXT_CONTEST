'use client';

import { useEffect } from "react";
import { DamageInput1 } from "@/components/report/report";

export default function DanmageReport1() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
        <DamageInput1 />
    )
}
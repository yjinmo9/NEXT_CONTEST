'use client';

import { useEffect } from "react";
import DamageInput1 from "@/components/report/Inputs/DamageInput1";

export default function DanmageReport1() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
            <DamageFormStep1 />
    )
}
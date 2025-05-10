'use client';

import { useEffect } from "react";
import MissingInput2 from "@/components/report/Inputs/MissingInput2";

export default function DanmageReport2() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
        <MissingFormStep2/>
    )
}
'use client';

import { useEffect } from "react";
import MissingInput1 from "@/components/report/Inputs/MissingInput1";

export default function DanmageReport1() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
        <MissingFormStep1 />
    )
}
'use client';

import { useEffect } from "react";
import MissingFormStep1 from "@/components/report/inputs/MissingFormStep1";

export default function DanmageReport1() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
        <MissingFormStep1 />
    )
}
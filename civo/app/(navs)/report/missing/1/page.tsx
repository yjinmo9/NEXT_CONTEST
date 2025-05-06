'use client';

import { useEffect } from "react";
import {MissingInput1 } from "@/components/report/report";

export default function DanmageReport1() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
        <MissingInput1 />
    )
}
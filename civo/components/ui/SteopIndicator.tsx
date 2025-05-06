// components/ui/StepIndicator.tsx
"use client";

import React from "react";

interface StepIndicatorProps {
  current: number; // 현재 스텝 (1 or 2)
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-[6px] self-end mt-[-10px] mr-[4px]">
      {/* Step 1 */}
      <div
        className={`w-[22px] h-[22px] rounded-full text-[12px] flex items-center justify-center
          ${
            current === 1
              ? "bg-black text-white"
              : "border border-black text-black text-[13px]"
          }`}
      >
        {current === 1 ? "1" : "✓"}
      </div>

      {/* Dot line */}
      <div className="w-[16px] border-t border-dotted border-gray-400" />

      {/* Step 2 */}
      <div
        className={`w-[22px] h-[22px] rounded-full text-[12px] flex items-center justify-center
          ${current === 2 ? "bg-black text-white" : "border border-gray-400 text-gray-600"}`}
      >
        2
      </div>
    </div>
  );
}

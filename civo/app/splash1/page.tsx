// app/splash1/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Splash1() {
  const router = useRouter();
  const [startAnim, setStartAnim] = useState(false);
  const [showCivo, setShowCivo] = useState(false);

  // 애니메이션/이동 타이밍
  useEffect(() => {
    const t1 = setTimeout(() => setShowCivo(true), 1000); // CIVO 등장
    const t2 = setTimeout(() => setStartAnim(true), 3000); // 이동 시작
    const t3 = setTimeout(() => router.push("/home"), 4200); // 페이지 이동

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 최종 위치 좌표 (left-1/2, top-1/2 기준)
  const targetPositions = [
    { x: 25, y: -40 }, // C
    { x: 25, y: -30 },  // I
    { x: -7, y: 10 },   // V
    { x: -18, y: -40 },   //0
  ];

  const initialOffsets = [ 18, 10, 2, -10]; // 중앙 기준 오프셋

  const initialY = 40;


  return (
    <div className="h-screen relative flex flex-col items-center justify-start pt-[30vh] bg-white">

  

      

      {/* ✅ 시민 보고 텍스트 */}
        <motion.h1
        className="text-4xl font-bold mb-6 z-10 absolute"
        initial={{ opacity: 0, y: 10 }}
        animate={startAnim ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        시민 보고
      </motion.h1>

      {/* ✅ CIVO */}
      {showCivo && (
        <motion.div
          className="absolute flex gap-2 text-5xl font-black z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          
          {["C", "I", "V", "O"].map((char, i) => (
              <motion.div
                key={char}
                
                initial={{ x: initialOffsets[i], y: initialY }}
                animate={startAnim ? targetPositions[i] : { x: initialOffsets[i], y: initialY }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-100"
              >
              
              
              {/* 글자 */}
              <div>{char}</div>

              <div className="h-[16px]" />
              
            
              </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}  




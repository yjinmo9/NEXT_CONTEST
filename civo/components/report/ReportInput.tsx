// components/report/ReportInput.tsx
'use client';

import { usePathname } from 'next/navigation';
import { IncidentInput, MissingInput1, MissingInput2, DamageInput1, DamageInput2 } from './report';

// default export 대신 named export로 변경
export function ReportInput() {
  const pathname = usePathname();
  
  if (pathname === '/report/incident') {
    return <IncidentInput />;
  } else if (pathname === '/report/missing/1') {
    return <MissingInput1 />;
  } else if (pathname === '/report/missing/2') {
    return <MissingInput2 />;
  } else if (pathname === '/report/damage/1') {
    return <DamageInput1 />;
  } else if (pathname === '/report/damage/2') {
    return <DamageInput2 />;
  }
  
  // 기본값
  return <IncidentInput />;
}
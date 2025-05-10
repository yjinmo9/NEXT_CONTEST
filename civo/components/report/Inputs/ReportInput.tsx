// components/report/ReportInput.tsx
'use client';

import { usePathname } from 'next/navigation';
import IncidentInput from './IncidentReport';
import MissingInput1 from './MissingInput1';
import MissingInput2 from './MissingInput2';
import DamageInput1 from './DamageInput1';
import DamageInput2 from './DamageInput2';

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
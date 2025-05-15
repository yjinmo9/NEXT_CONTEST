'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/splash1'); // 앱 실행 시 /splash1으로 이동
  }, []);

  return null; // 아무것도 렌더링하지 않음
}

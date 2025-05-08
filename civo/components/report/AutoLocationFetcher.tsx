'use client';

import { useEffect, useState } from 'react';

export default function AutoLocationFetcher() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`/api/location?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          const roadAddr = data.results?.find((r: any) => r.name === 'roadaddr');
          const fullAddr = [
            roadAddr?.region?.area1?.name,
            roadAddr?.region?.area2?.name,
            roadAddr?.land?.name,
            roadAddr?.land?.number1,
          ].filter(Boolean).join(' ');

          setAddress(fullAddr || '주소를 찾을 수 없습니다.');
        } catch (err) {
          setError('주소 정보를 가져오는 중 오류 발생');
        }
      },
      () => {
        setError('위치 접근이 거부되었습니다.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return (
    <div className='text-black'>
      <p>{address || '불러오는 중...'}</p>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

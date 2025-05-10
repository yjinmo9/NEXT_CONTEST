// components/shared/LocationSelector.tsx
import { useEffect, useState } from 'react';
import { Coordinates } from '@/components/home/map';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onCoordsChange: (coords: Coordinates) => void;
}

export function LocationSelector({ value, onChange, onCoordsChange }: LocationSelectorProps) {
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const c: Coordinates = [
        position.coords.longitude,
        position.coords.latitude,
      ];
      setCoords(c);
      onCoordsChange(c);
    });
  }, []);

  return (
    <div className="mb-6">
      <label className="font-semibold text-[15px]">사고 위치 <span className="text-red-700">*</span></label>
      <div className="py-[8px] mt-[12px] border rounded-[10px] border-formborder px-4">
        <p className="text-[15px] text-black">{value || '현재 위치를 가져오는 중...'}</p>
      </div>
    </div>
  );
}



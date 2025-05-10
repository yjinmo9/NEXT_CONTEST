// components/shared/CategorySelector.tsx
import React from 'react';

interface CategorySelectorProps {
  value: string | null;
  onChange: (value: string) => void;
}

const categories = ['화재', '인구밀집', '교통사고', '기타'];

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="mb-6">
      <label className="font-semibold text-[15px]">사고 유형 <span className="text-red-700">*</span></label>
      <div className="mt-[12px] h-[30px] flex flex-wrap gap-2">
        {categories.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`px-4 py-1 text-sm border rounded-[10px] transition 
              ${value === type ? 'bg-black text-white border-black' : 'text-black border-black hover:bg-gray-100'}`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

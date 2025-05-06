// app/context/DamageFormContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type DamageFormData = {
  title: string;
  content: string;
};

type DamageFormContextType = {
  data: DamageFormData;
  setData: (data: Partial<DamageFormData>) => void;
};

const DamageFormContext = createContext<DamageFormContextType | undefined>(undefined);

export function DamageFormProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<DamageFormData>({
    title: '',
    content: '',
  });

  const setData = (partial: Partial<DamageFormData>) => {
    setDataState((prev) => ({ ...prev, ...partial }));
  };

  return (
    <DamageFormContext.Provider value={{ data, setData }}>
      {children}
    </DamageFormContext.Provider>
  );
}

export function useDamageForm() {
  const context = useContext(DamageFormContext);
  if (!context) throw new Error('useDamageForm must be used within DamageFormProvider');
  return context;
}

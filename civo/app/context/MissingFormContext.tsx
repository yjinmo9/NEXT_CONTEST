// app/context/MissingFormContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type MissingFormData = {
  name: string;
  age: number;
  gender: string;
  content: string;
  missing_lat?: number;
  missing_lng?: number;
};

type MissingFormContextType = {
  data: MissingFormData;
  setData: (data: Partial<MissingFormData>) => void;
};

const MissingFormContext = createContext<MissingFormContextType | undefined>(undefined);

export function MissingFormProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<MissingFormData>({
    name: '',
    age: 0,
    gender: '',
    content: '',
    missing_lat: 0,
    missing_lng: 0,
  });

  const setData = (partial: Partial<MissingFormData>) => {
    setDataState((prev) => ({ ...prev, ...partial }));
  };

  return (
    <MissingFormContext.Provider value={{ data, setData }}>
      {children}
    </MissingFormContext.Provider>
  );
}

export function useMissingForm() {
  const context = useContext(MissingFormContext);
  if (!context) throw new Error('useMissingForm must be used within MissingFormProvider');
  return context;
}

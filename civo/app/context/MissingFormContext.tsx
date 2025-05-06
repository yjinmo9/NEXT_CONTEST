// app/context/MissingFormContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type MissingFormData = {
  name: string;
  gender: string;
  age: number;
  content: string;
};

type MissingFormContextType = {
  data: MissingFormData;
  setData: (data: Partial<MissingFormData>) => void;
};

const MissingFormContext = createContext<MissingFormContextType | undefined>(undefined);

export function MissingFormProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<MissingFormData>({
    name: '',
    gender: '',
    age: 0,
    content: '',
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

import React, { createContext, useContext, useState, ReactNode } from 'react';

const MultiSigFormContext = createContext({});

export function MultiSigFormContextProvider({ children }: { children: ReactNode }) {
  const [inputForm, setInputForm] = useState({
    msName: '',
    msDescription: '',
    msOwners: [],
    msThreshold: ''
  });

  return <MultiSigFormContext.Provider value={{ inputForm, setInputForm }}>{children}</MultiSigFormContext.Provider>;
}

export function useMultiSigFormContext() {
  return useContext(MultiSigFormContext);
}

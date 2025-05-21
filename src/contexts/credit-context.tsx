
"use client";

import type { ReactNode} from 'react';
import React, { createContext, useContext, useState } from 'react';

interface CreditContextType {
  creditBalance: number;
  deductCredits: (amount: number) => void;
  // Future: addCredits, setCreditBalance, etc.
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

// Placeholder initial credits. In a real app, this might come from user data.
const INITIAL_CREDITS = 100; 

export const CreditProvider = ({ children }: { children: ReactNode }) => {
  const [creditBalance, setCreditBalance] = useState<number>(INITIAL_CREDITS);

  const deductCredits = (amount: number) => {
    setCreditBalance((prevBalance) => {
      const newBalance = prevBalance - amount;
      // Ensure balance doesn't go below zero, though modal should prevent this.
      return newBalance < 0 ? 0 : newBalance; 
    });
  };

  return (
    <CreditContext.Provider value={{ creditBalance, deductCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = (): CreditContextType => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};

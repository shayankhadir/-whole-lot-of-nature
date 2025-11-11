'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage?: string;
  setLoadingMessage: (message?: string) => void;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  progress: number;
  setProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);

  const startLoading = (message?: string) => {
    setIsLoading(true);
    if (message) setLoadingMessage(message);
    setProgress(0);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
    setProgress(100);
  };

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        setIsLoading, 
        loadingMessage, 
        setLoadingMessage,
        startLoading,
        stopLoading,
        progress,
        setProgress
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

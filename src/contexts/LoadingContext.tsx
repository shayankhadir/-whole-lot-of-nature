'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react';

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  show: (initialProgress?: number) => void;
  hide: () => void;
  setProgress: (progress: number) => void;
  simulateProgress: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback((initialProgress = 10) => {
    setIsLoading(true);
    setProgress(initialProgress);
  }, []);

  const hide = useCallback(() => {
    // Jump to 100% before hiding
    setProgress(100);
    
    // Clear any ongoing progress simulation
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Give a small delay to show 100%, then hide loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const simulateProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        // Increase progress smoothly
        if (prev < 30) return prev + Math.random() * 20;
        if (prev < 60) return prev + Math.random() * 15;
        if (prev < 85) return prev + Math.random() * 10;
        if (prev < 95) return prev + Math.random() * 5;
        // Cap at 98% - let hide() complete it to 100%
        return Math.min(prev + Math.random() * 2, 98);
      });
    }, 150);
  }, []);

  const updateProgress = useCallback((value: number) => {
    setProgress(Math.min(Math.max(value, 0), 100));
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        show,
        hide,
        setProgress: updateProgress,
        simulateProgress,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    console.error(
      'useLoading must be used within LoadingProvider. ' +
      'Make sure LoadingProvider wraps the component using useLoading in your layout.'
    );
    throw new Error(
      'useLoading must be used within LoadingProvider. ' +
      'Check console for details.'
    );
  }
  return context;
}

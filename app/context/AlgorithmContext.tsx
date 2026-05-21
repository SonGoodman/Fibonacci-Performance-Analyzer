'use client';

import React, { createContext, useCallback, useState } from 'react';

export interface AlgorithmResult {
  value: number;
  executionTime: number;
  functionCalls: number;
  maxStackDepth?: number;
  arraySize?: number;
  arrayData?: number[];
}

export interface AlgorithmState {
  n: number;
  recursionResult: AlgorithmResult | null;
  dpResult: AlgorithmResult | null;
  isRunningRecursion: boolean;
  isRunningDP: boolean;
  recursionTreeData: any;
  dpArrayData: number[];
}

export interface AlgorithmContextType extends AlgorithmState {
  setN: (n: number) => void;
  runRecursion: () => Promise<void>;
  runDP: () => Promise<void>;
  runComparison: () => Promise<void>;
  clearResults: () => void;
}

export const AlgorithmContext = createContext<AlgorithmContextType | undefined>(undefined);

function createRecursionWorkerBlob() {
  const code = `
let callCount = 0;
let maxDepth = 0;
let currentDepth = 0;

function fibRecursive(n) {
  currentDepth++;
  maxDepth = Math.max(maxDepth, currentDepth);
  callCount++;

  if (n <= 1) {
    currentDepth--;
    return n;
  }

  const result = fibRecursive(n - 1) + fibRecursive(n - 2);
  currentDepth--;
  return result;
}

self.onmessage = (event) => {
  const { type, n } = event.data;

  if (type === 'start' && n !== undefined) {
    callCount = 0;
    maxDepth = 0;
    currentDepth = 0;

    const startTime = performance.now();
    const value = fibRecursive(n);
    const endTime = performance.now();

    const result = {
      value,
      executionTime: endTime - startTime,
      functionCalls: callCount,
      maxStackDepth: maxDepth,
    };

    self.postMessage(result);
  }
};
  `;
  return new Blob([code], { type: 'application/javascript' });
}

function createDPWorkerBlob() {
  const code = `
function fibDP(n) {
  const dp = [0, 1];
  let operations = 0;

  for (let i = 2; i <= n; i++) {
    operations++;
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return {
    value: dp[n],
    operations: operations + 2,
    array: dp,
  };
}

self.onmessage = (event) => {
  const { type, n } = event.data;

  if (type === 'start' && n !== undefined) {
    const startTime = performance.now();
    const { value, operations, array } = fibDP(n);
    const endTime = performance.now();

    const result = {
      value,
      executionTime: endTime - startTime,
      functionCalls: operations,
      arraySize: array.length,
      arrayData: array.slice(0, Math.min(100, array.length)),
    };

    self.postMessage(result);
  }
};
  `;
  return new Blob([code], { type: 'application/javascript' });
}

export function AlgorithmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlgorithmState>({
    n: 20,
    recursionResult: null,
    dpResult: null,
    isRunningRecursion: false,
    isRunningDP: false,
    recursionTreeData: null,
    dpArrayData: [],
  });

  const [recursionWorker, setRecursionWorker] = useState<Worker | null>(null);
  const [dpWorker, setDPWorker] = useState<Worker | null>(null);

  const initializeWorkers = useCallback(() => {
    if (!recursionWorker) {
      const blob = createRecursionWorkerBlob();
      const worker = new Worker(URL.createObjectURL(blob));
      setRecursionWorker(worker);
    }
    if (!dpWorker) {
      const blob = createDPWorkerBlob();
      const worker = new Worker(URL.createObjectURL(blob));
      setDPWorker(worker);
    }
  }, [recursionWorker, dpWorker]);

  const setN = useCallback((n: number) => {
    setState((prev) => ({ ...prev, n: Math.max(0, Math.min(150, n)) }));
  }, []);

  const runRecursion = useCallback(async () => {
    initializeWorkers();

    return new Promise<void>((resolve) => {
      if (!recursionWorker) return resolve();

      setState((prev) => ({ ...prev, isRunningRecursion: true }));

      const handler = (event: MessageEvent<AlgorithmResult>) => {
        setState((prev) => ({
          ...prev,
          recursionResult: event.data,
          isRunningRecursion: false,
        }));
        recursionWorker.removeEventListener('message', handler);
        resolve();
      };

      recursionWorker.addEventListener('message', handler);
      recursionWorker.postMessage({ type: 'start', n: state.n <= 40 ? state.n : 40 });
    });
  }, [recursionWorker, state.n, initializeWorkers]);

  const runDP = useCallback(async () => {
    initializeWorkers();

    return new Promise<void>((resolve) => {
      if (!dpWorker) return resolve();

      setState((prev) => ({ ...prev, isRunningDP: true }));

      const handler = (event: MessageEvent<AlgorithmResult>) => {
        setState((prev) => ({
          ...prev,
          dpResult: event.data,
          dpArrayData: event.data.arrayData || [],
          isRunningDP: false,
        }));
        dpWorker.removeEventListener('message', handler);
        resolve();
      };

      dpWorker.addEventListener('message', handler);
      dpWorker.postMessage({ type: 'start', n: state.n });
    });
  }, [dpWorker, state.n, initializeWorkers]);

  const runComparison = useCallback(async () => {
    await Promise.all([runRecursion(), runDP()]);
  }, [runRecursion, runDP]);

  const clearResults = useCallback(() => {
    setState((prev) => ({
      ...prev,
      recursionResult: null,
      dpResult: null,
      recursionTreeData: null,
      dpArrayData: [],
    }));
  }, []);

  const value: AlgorithmContextType = {
    ...state,
    setN,
    runRecursion,
    runDP,
    runComparison,
    clearResults,
  };

  return (
    <AlgorithmContext.Provider value={value}>
      {children}
    </AlgorithmContext.Provider>
  );
}

export function useAlgorithm() {
  const context = React.useContext(AlgorithmContext);
  if (!context) {
    throw new Error('useAlgorithm must be used within AlgorithmProvider');
  }
  return context;
}

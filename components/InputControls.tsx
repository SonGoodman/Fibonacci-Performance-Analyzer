'use client';

import { useAlgorithm } from '@/app/context/AlgorithmContext';

export function InputControls() {
  const { n, setN, runRecursion, runDP, runComparison, isRunningRecursion, isRunningDP } =
    useAlgorithm();

  const maxRecursionN = 40;
  const maxDPN = 150;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Input Controls</h2>

      <div className="mb-8">
        <label className="block text-sm font-semibold mb-3">
          Select N (Fibonacci Index): {n}
        </label>
        <input
          type="range"
          min="0"
          max={maxDPN}
          value={n}
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full accent-slate-600"
          disabled={isRunningRecursion || isRunningDP}
        />
        <div className="text-xs text-slate-500 mt-2">
          Recursion safe up to N={maxRecursionN} | DP supports up to N={maxDPN}
        </div>
      </div>

      <div className="mb-8">
        <input
          type="number"
          min="0"
          max={maxDPN}
          value={n}
          onChange={(e) => setN(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
          disabled={isRunningRecursion || isRunningDP}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={runRecursion}
          disabled={isRunningRecursion || isRunningDP || n > maxRecursionN}
          className="button-primary disabled:opacity-50"
        >
          {isRunningRecursion ? 'Running...' : 'Run Recursion'}
        </button>

        <button
          onClick={runDP}
          disabled={isRunningDP || isRunningRecursion}
          className="button-primary disabled:opacity-50"
        >
          {isRunningDP ? 'Running...' : 'Run DP'}
        </button>

        <button
          onClick={runComparison}
          disabled={isRunningRecursion || isRunningDP || n > maxRecursionN}
          className="button-primary disabled:opacity-50"
        >
          {isRunningRecursion || isRunningDP ? 'Running...' : 'Run Comparison'}
        </button>
      </div>

      {n > maxRecursionN && (
        <div className="mt-4 p-3 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
          ⚠ N is above the safe limit for recursion. Use only DP algorithm.
        </div>
      )}
    </div>
  );
}

'use client';

import { useAlgorithm } from '@/app/context/AlgorithmContext';

function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
}

export function MetricsDashboard() {
  const { recursionResult, dpResult, n } = useAlgorithm();

  if (!recursionResult && !dpResult) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Metrics Dashboard</h2>
        <p className="text-slate-400">Run an algorithm to see metrics</p>
      </div>
    );
  }

  const timeComparison = recursionResult && dpResult
    ? (recursionResult.executionTime / dpResult.executionTime).toFixed(2)
    : null;

  const operationsComparison = recursionResult && dpResult
    ? (recursionResult.functionCalls / dpResult.functionCalls).toFixed(2)
    : null;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Metrics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recursion Results */}
        {recursionResult && (
          <div className="metric-box">
            <h3 className="text-lg font-bold mb-4 text-slate-100">Naive Recursion (N={n})</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Result</p>
                <p className="font-mono text-lg font-bold">{recursionResult.value}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Execution Time</p>
                <p className="font-mono text-lg font-bold">
                  {recursionResult.executionTime.toFixed(3)} ms
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Function Calls</p>
                <p className="font-mono text-lg font-bold">
                  {formatNumber(recursionResult.functionCalls)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Max Stack Depth</p>
                <p className="font-mono text-lg font-bold">{recursionResult.maxStackDepth}</p>
              </div>
              <div className="bg-slate-700 p-2 rounded mt-3">
                <p className="text-xs font-semibold text-slate-200">Time Complexity: O(2^n)</p>
              </div>
            </div>
          </div>
        )}

        {/* DP Results */}
        {dpResult && (
          <div className="metric-box">
            <h3 className="text-lg font-bold mb-4 text-slate-100">Dynamic Programming (N={n})</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Result</p>
                <p className="font-mono text-lg font-bold">{dpResult.value}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Execution Time</p>
                <p className="font-mono text-lg font-bold">
                  {dpResult.executionTime.toFixed(3)} ms
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Operations</p>
                <p className="font-mono text-lg font-bold">
                  {formatNumber(dpResult.functionCalls)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Array Size</p>
                <p className="font-mono text-lg font-bold">{dpResult.arraySize}</p>
              </div>
              <div className="bg-slate-700 p-2 rounded mt-3">
                <p className="text-xs font-semibold text-slate-200">Time Complexity: O(n)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Section */}
      {recursionResult && dpResult && (
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="font-bold text-lg mb-3">Performance Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Speed Difference</p>
              <p className="font-mono text-lg font-bold">
                {timeComparison}x slower (Recursion)
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Operations Ratio</p>
              <p className="font-mono text-lg font-bold">
                {operationsComparison}x more calls (Recursion)
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            This dramatic difference demonstrates why understanding algorithmic optimization is
            crucial for performance-critical applications.
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useAlgorithm } from '@/app/context/AlgorithmContext';
import { motion } from 'framer-motion';

export function DPArrayVisualization() {
  const { dpResult, dpArrayData, n, isRunningDP } = useAlgorithm();

  if (isRunningDP) {
    return (
      <div className="dp-array-container flex items-center justify-center">
        <p className="text-slate-400">Computing DP array...</p>
      </div>
    );
  }

  if (!dpResult || dpArrayData.length === 0) {
    return (
      <div className="dp-array-container flex items-center justify-center">
        <p className="text-slate-400">Run DP algorithm to see array visualization</p>
      </div>
    );
  }

  const maxValue = Math.max(...dpArrayData);
  const displayData = dpArrayData.slice(0, Math.min(50, dpArrayData.length));

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Dynamic Programming Array (N={n})</h3>
      <p className="text-sm text-slate-400 mb-3">
        Each cell represents a computed Fibonacci value. DP builds the array linearly from left
        to right - O(n) time complexity!
      </p>

      <div className="dp-array-container">
        <div className="flex items-end justify-center gap-1 h-full">
          {displayData.map((value, index) => (
            <motion.div
              key={index}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${(value / maxValue) * 300}px`, opacity: 1 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
              className="bg-gradient-to-t from-green-500 to-green-400 rounded-t flex-1 min-w-0 relative group hover:from-green-600 hover:to-green-500 transition-colors"
              title={`Index ${index}: ${value}`}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-slate-100 text-xs px-2 py-1 rounded whitespace-nowrap">
                {index}: {value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-400">
        <p>
          Showing {displayData.length} of {dpArrayData.length} values
        </p>
        <p className="mt-2">
          <strong>F({n}) = {dpResult.value}</strong>
        </p>
      </div>
    </div>
  );
}

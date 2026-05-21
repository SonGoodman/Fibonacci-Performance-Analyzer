'use client';

import { AlgorithmProvider } from '@/app/context/AlgorithmContext';
import { Header } from '@/components/Header';
import { InputControls } from '@/components/InputControls';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { RecursionTreeVisualization } from '@/components/RecursionTreeVisualization';
import { DPArrayVisualization } from '@/components/DPArrayVisualization';

function PageContent() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <div className="container-custom py-12">
        <div className="space-y-8">
          {/* Input Controls */}
          <InputControls />

          {/* Metrics Dashboard */}
          <MetricsDashboard />

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <RecursionTreeVisualization />
            </div>

            <div className="card">
              <DPArrayVisualization />
            </div>
          </div>

          {/* Educational Content */}
          <div className="card bg-slate-800 border-slate-700">
            <h2 className="text-2xl font-bold mb-4">💡 Key Takeaways</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-slate-100 mb-2">Overlapping Subproblems</h3>
                <p className="text-slate-400">
                  Notice how the recursion tree repeats the same Fibonacci calculations many times.
                  For example, fib(5) is calculated multiple times within a single fib(10) call.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-100 mb-2">Memoization Power</h3>
                <p className="text-slate-400">
                  Dynamic programming stores computed results, avoiding redundant calculations. This
                  transforms the time complexity from exponential O(2<sup>n</sup>) to linear O(n).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-100 mb-2">Real-World Impact</h3>
                <p className="text-slate-400">
                  At N=40, recursion can take seconds while DP completes in milliseconds. For N=100,
                  recursion would take longer than the age of the universe!
                </p>
              </div>

              <div className="bg-slate-700 p-4 rounded border border-slate-600 mt-4">
                <p className="text-sm font-mono text-slate-300">
                  <strong>Try this:</strong> Compare fib(35) with recursion vs DP to see the
                  dramatic difference in execution time and function calls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="container-custom text-center">
          <p>
            Fibonacci Performance Visualizer - Educational Tool for Algorithm Analysis
          </p>
          <p className="text-sm mt-2">
            Built with React, Next.js, D3.js, and Web Workers
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AlgorithmProvider>
      <PageContent />
    </AlgorithmProvider>
  );
}

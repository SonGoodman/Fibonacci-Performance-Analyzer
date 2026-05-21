'use client';

export function Header() {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Fibonacci Performance Visualizer
        </h1>
        <p className="text-xl text-slate-400 mb-6">
          Understand the dramatic difference between recursion and dynamic programming
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Naive Recursion</h3>
            <p className="text-slate-400">
              Time: O(2<sup>n</sup>) - Exponential explosion of redundant calculations
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Dynamic Programming</h3>
            <p className="text-slate-400">
              Time: O(n) - Linear computation with memoization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

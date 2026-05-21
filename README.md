# Fibonacci Performance Visualizer

An interactive, educational web application that dramatically demonstrates the performance difference between naive recursive and dynamic programming approaches to computing Fibonacci numbers.

## Overview

This application is designed for:
- **Computer Science Students** learning about algorithms and Big-O notation
- **Educators** teaching algorithmic optimization concepts
- **Junior Developers** building intuition about performance optimization

## Key Features

### 1. Interactive Input Controls
- **N-Value Selector**: Slider and numeric input for choosing the Fibonacci index (0-150)
- **Safety Limits**: Recursion capped at N≤40 to prevent browser crashes; DP allows N>100
- **Three Execution Modes**:
  - Run Recursion (naive approach)
  - Run DP (dynamic programming approach)  
  - Run Comparison (both algorithms side-by-side)

### 2. Real-Time Metrics Dashboard
Displays comprehensive performance metrics post-execution:
- **Execution Time** (milliseconds)
- **Function Calls** (operations count)
- **Stack Depth** (recursion) vs Array Size (DP)
- **Time Complexity Comparison**: Actual time ratio between approaches
- **Operations Ratio**: Function calls comparison

### 3. Dynamic Visualizations

#### Recursion Tree Visualization
- **D3.js-powered** expanding tree graph
- Shows massive O(2^n) branching factor
- Highlights duplicated subproblems
- Makes overlapping subproblems visually obvious
- Limited to N≤15 for reasonable rendering

#### DP Array Visualization
- **Framer Motion-animated** bar chart
- Shows linear O(n) computation
- Bars fill left-to-right sequentially
- Hover for individual values
- Displays computation in real-time

### 4. Web Workers for Non-Blocking Execution
- All algorithm execution happens in background workers
- Main UI thread stays responsive even during intensive computation
- Supports monitoring of recursion beyond typical limits

### 5. Educational Content
- "Key Takeaways" section explaining:
  - Overlapping subproblems concept
  - Memoization power
  - Real-world performance impact
- Practical challenges (e.g., "Compare fib(35)")

## Technical Stack

- **Frontend Framework**: Next.js 16.2.6 with React 19
- **Styling**: Tailwind CSS
- **Visualization**: D3.js (tree) + Framer Motion (animations)
- **State Management**: React Context API
- **Threading**: Web Workers API (Blob-based workers)
- **Language**: TypeScript

## Project Structure

```
fibonacci-performance-analyzer/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page component
│   ├── globals.css             # Global styles
│   ├── context/
│   │   └── AlgorithmContext.tsx # State management & worker orchestration
│   └── ...
├── components/
│   ├── Header.tsx              # Hero section
│   ├── InputControls.tsx       # N-selector & execution buttons
│   ├── MetricsDashboard.tsx    # Performance metrics display
│   ├── RecursionTreeVisualization.tsx  # D3 tree graph
│   ├── DPArrayVisualization.tsx        # Framer Motion bar chart
│   └── ...
├── public/
│   ├── recursion-worker.js     # Naive recursion worker
│   └── dp-worker.js            # DP algorithm worker
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Running the Application

### Development Mode
```bash
npm install
npm run dev
```
Opens at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
```

## How It Works

### Algorithm Comparison

#### Naive Recursion: O(2^n)
```
fib(5) = fib(4) + fib(3)
       = [fib(3) + fib(2)] + [fib(2) + fib(1)]
       = [[fib(2) + fib(1)] + [fib(1) + fib(0)]] + ...
```
**Problem**: Exponential redundant calculations

#### Dynamic Programming: O(n)
```
dp[0] = 0
dp[1] = 1
For i from 2 to n:
  dp[i] = dp[i-1] + dp[i-2]
```
**Solution**: Compute each value once, reuse results

### Web Workers Architecture

The app uses Blob-based Web Workers to avoid module resolution issues:

1. **Recursion Worker**: Counts function calls and tracks stack depth
2. **DP Worker**: Tracks array construction and operations
3. **Main Thread**: Handles UI, state management, and visualization

This architecture ensures the browser remains responsive even when computing recursive Fibonacci beyond N=40.

## Learning Outcomes

After using this application, students will understand:

1. **Overlapping Subproblems**: How recursive solutions redundantly solve the same subproblems
2. **Exponential Growth**: Visual representation of O(2^n) explosion
3. **Memoization/Tabulation**: How storing results eliminates redundant work
4. **Big-O Notation**: Concrete, measurable difference between O(2^n) and O(n)
5. **Real-World Impact**: Practical implications of algorithm choice

## Performance Expectations

| N | Recursion | DP | Ratio |
|---|-----------|-----|-------|
| 20 | ~1ms | <0.1ms | 10x |
| 30 | ~50ms | <0.1ms | 500x |
| 35 | ~1-5s | <0.1ms | 10,000x+ |
| 40 | ~10-30s | <0.1ms | 100,000x+ |

*Actual times vary by browser and hardware*

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any browser supporting ES2020, Web Workers, and CSS Grid

## Out of Scope (V1)

- BigInt support for extremely large Fibonacci numbers
- Matrix exponentiation (O(log n)) approach
- Memoization technique visualization
- Export/sharing of results

## Future Enhancements

- Side-by-side code comparison
- Step-by-step animation of execution
- Memory usage visualization
- Other DP examples (Knapsack, LCS, etc.)
- Memoization vs Tabulation comparison
- Custom algorithm uploads

## Educational Use

### Classroom Activities

1. **Demonstration**: Show the dramatic time difference at N=35
2. **Prediction**: Have students predict execution times before running
3. **Analysis**: Discuss why overlapping subproblems occur
4. **Exploration**: Ask students what changes from N to N+1

### Assignment Ideas

1. Implement third algorithm (memoization with decorator)
2. Explain the tree structure for fib(7)
3. Calculate theoretical O(2^n) operations vs measured
4. Research other DP problems

## Built For Learning

This is an educational tool designed to make abstract computer science concepts concrete and intuitive. The visual and quantitative approach helps students move from theoretical understanding to practical insight about algorithmic optimization.

---

**Version**: 1.0.0  
**Created**: 2026  
**License**: MIT  
**Technologies**: React, Next.js, D3.js, Framer Motion, Web Workers, TypeScript

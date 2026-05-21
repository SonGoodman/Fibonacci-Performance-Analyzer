interface RecursionWorkerMessage {
  type: 'start' | 'stop';
  n?: number;
}

interface RecursionResult {
  value: number;
  executionTime: number;
  functionCalls: number;
  maxStackDepth: number;
  treeData?: any;
}

let callCount = 0;
let maxDepth = 0;
let currentDepth = 0;

function fibRecursive(n: number): number {
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

self.onmessage = (event: MessageEvent<RecursionWorkerMessage>) => {
  const { type, n } = event.data;

  if (type === 'start' && n !== undefined) {
    callCount = 0;
    maxDepth = 0;
    currentDepth = 0;

    const startTime = performance.now();
    const value = fibRecursive(n);
    const endTime = performance.now();

    const result: RecursionResult = {
      value,
      executionTime: endTime - startTime,
      functionCalls: callCount,
      maxStackDepth: maxDepth,
    };

    self.postMessage(result);
  }
};

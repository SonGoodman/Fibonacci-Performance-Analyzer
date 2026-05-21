interface DPWorkerMessage {
  type: 'start' | 'stop';
  n?: number;
}

interface DPResult {
  value: number;
  executionTime: number;
  functionCalls: number;
  arraySize: number;
  arrayData?: number[];
}

function fibDP(n: number): { value: number; operations: number; array: number[] } {
  const dp: number[] = [0, 1];
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

self.onmessage = (event: MessageEvent<DPWorkerMessage>) => {
  const { type, n } = event.data;

  if (type === 'start' && n !== undefined) {
    const startTime = performance.now();
    const { value, operations, array } = fibDP(n);
    const endTime = performance.now();

    const result: DPResult = {
      value,
      executionTime: endTime - startTime,
      functionCalls: operations,
      arraySize: array.length,
      arrayData: array.slice(0, Math.min(100, array.length)),
    };

    self.postMessage(result);
  }
};

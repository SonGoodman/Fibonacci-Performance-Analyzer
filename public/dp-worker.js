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

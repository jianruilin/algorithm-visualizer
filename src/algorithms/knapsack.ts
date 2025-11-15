import type { AlgorithmSnapshot, AlgorithmInput, CellState, DPTable } from '../types/algorithm';

/**
 * 0-1背包问题算法实现
 * 使用动态规划求解，同时生成每一步的快照用于可视化
 */
export function knapsackAlgorithm(input: AlgorithmInput): AlgorithmSnapshot[] {
  const { weights = [], values = [], capacity = 0 } = input;
  const n = weights.length;

  if (n === 0 || capacity === 0) {
    return [];
  }

  const snapshots: AlgorithmSnapshot[] = [];
  let snapshotId = 0;

  // 创建DP表格: dp[i][w] 表示前i个物品，容量为w时的最大价值
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  // 辅助函数：创建当前DP表格的快照
  const createSnapshot = (
    currentLine: number,
    description: string,
    operation: AlgorithmSnapshot['operation'],
    highlightCells: { row: number; col: number; status: CellState['status'] }[] = [],
    variables: any = {},
    comparison?: AlgorithmSnapshot['comparison']
  ): void => {
    // 构建单元格状态
    const cells: CellState[][] = dp.map((row, i) =>
      row.map((value, w) => {
        // 检查是否需要高亮
        const highlight = highlightCells.find(h => h.row === i && h.col === w);
        return {
          row: i,
          col: w,
          value,
          status: highlight?.status || 'default',
        };
      })
    );

    const dpTable: DPTable = {
      rows: n + 1,
      cols: capacity + 1,
      cells,
      rowLabels: ['0', ...weights.map((_, idx) => `物品${idx + 1}`)],
      colLabels: Array.from({ length: capacity + 1 }, (_, i) => i.toString()),
    };

    // 变量列表
    const variableList = [
      { name: 'n', value: n, type: 'number', changed: false },
      { name: 'capacity', value: capacity, type: 'number', changed: false },
      { name: 'weights', value: `[${weights.join(', ')}]`, type: 'array', changed: false },
      { name: 'values', value: `[${values.join(', ')}]`, type: 'array', changed: false },
      ...Object.entries(variables).map(([name, value]) => ({
        name,
        value,
        type: typeof value,
        changed: true,
      })),
    ];

    snapshots.push({
      id: snapshotId++,
      currentLine,
      dpTable,
      variables: variableList,
      description,
      operation,
      comparison,
    });
  };

  // 第0步：初始化DP表格
  createSnapshot(
    2,
    '初始化DP表格，所有值为0。dp[i][w]表示前i个物品在容量为w时的最大价值',
    'init'
  );

  // 动态规划主循环
  for (let i = 1; i <= n; i++) {
    const currentWeight = weights[i - 1];
    const currentValue = values[i - 1];

    createSnapshot(
      4,
      `开始处理物品${i}：重量=${currentWeight}, 价值=${currentValue}`,
      'init',
      [{ row: i, col: 0, status: 'current' }],
      { i, currentWeight, currentValue }
    );

    for (let w = 0; w <= capacity; w++) {
      if (w < currentWeight) {
        // 容量不足，无法放入该物品
        dp[i][w] = dp[i - 1][w];

        createSnapshot(
          8,
          `容量${w} < 物品重量${currentWeight}，无法放入，继承上一行的值：dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}`,
          'decision',
          [
            { row: i - 1, col: w, status: 'comparing' },
            { row: i, col: w, status: 'current' },
          ],
          { i, w, currentWeight, currentValue }
        );
      } else {
        // 可以选择放或不放
        const notTake = dp[i - 1][w];
        const take = dp[i - 1][w - currentWeight] + currentValue;

        createSnapshot(
          11,
          `容量${w}够放物品${i}，比较两种选择：\n不放: dp[${i - 1}][${w}] = ${notTake}\n放入: dp[${i - 1}][${w - currentWeight}] + ${currentValue} = ${take}`,
          'compare',
          [
            { row: i - 1, col: w, status: 'comparing' },
            { row: i - 1, col: w - currentWeight, status: 'comparing' },
            { row: i, col: w, status: 'current' },
          ],
          { i, w, notTake, take },
          {
            left: { label: '不放', value: notTake },
            right: { label: '放入', value: take },
            result: take > notTake,
          }
        );

        dp[i][w] = Math.max(notTake, take);

        createSnapshot(
          13,
          `选择${dp[i][w] === take ? '放入' : '不放'}物品${i}，dp[${i}][${w}] = ${dp[i][w]}`,
          'update',
          [{ row: i, col: w, status: 'optimal' }],
          { i, w, result: dp[i][w] }
        );
      }
    }
  }

  // 回溯找出选中的物品
  const selectedItems: number[] = [];
  let w = capacity;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(i);
      w -= weights[i - 1];
    }
  }

  createSnapshot(
    15,
    `算法完成！最大价值: ${dp[n][capacity]}\n选中的物品: ${selectedItems.reverse().join(', ')}`,
    'complete',
    [{ row: n, col: capacity, status: 'optimal' }],
    { maxValue: dp[n][capacity], selectedItems: selectedItems.join(', ') }
  );

  return snapshots;
}

import type { AlgorithmSnapshot, AlgorithmInput, CellState, DPTable } from '../types/algorithm';

/**
 * 最长公共子序列（LCS）算法实现
 * 使用动态规划求解，同时生成每一步的快照用于可视化
 */
export function lcsAlgorithm(input: AlgorithmInput): AlgorithmSnapshot[] {
  const { str1 = '', str2 = '' } = input;
  const m = str1.length;
  const n = str2.length;

  if (m === 0 || n === 0) {
    return [];
  }

  const snapshots: AlgorithmSnapshot[] = [];
  let snapshotId = 0;

  // 创建DP表格: dp[i][j] 表示str1[0..i-1]和str2[0..j-1]的LCS长度
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  // 辅助函数：创建快照
  const createSnapshot = (
    currentLine: number,
    description: string,
    operation: AlgorithmSnapshot['operation'],
    highlightCells: { row: number; col: number; status: CellState['status']; annotation?: string }[] = [],
    variables: any = {},
    comparison?: AlgorithmSnapshot['comparison']
  ): void => {
    const cells: CellState[][] = dp.map((row, i) =>
      row.map((value, j) => {
        const highlight = highlightCells.find(h => h.row === i && h.col === j);
        return {
          row: i,
          col: j,
          value,
          status: highlight?.status || 'default',
          annotation: highlight?.annotation,
        };
      })
    );

    const dpTable: DPTable = {
      rows: m + 1,
      cols: n + 1,
      cells,
      rowLabels: ['∅', ...str1.split('')],
      colLabels: ['∅', ...str2.split('')],
    };

    const variableList = [
      { name: 'str1', value: `"${str1}"`, type: 'string', changed: false },
      { name: 'str2', value: `"${str2}"`, type: 'string', changed: false },
      { name: 'm', value: m, type: 'number', changed: false },
      { name: 'n', value: n, type: 'number', changed: false },
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

  // 初始化
  createSnapshot(
    2,
    '初始化DP表格。dp[i][j]表示str1前i个字符和str2前j个字符的最长公共子序列长度',
    'init'
  );

  // 动态规划主循环
  for (let i = 1; i <= m; i++) {
    const char1 = str1[i - 1];

    for (let j = 1; j <= n; j++) {
      const char2 = str2[j - 1];

      createSnapshot(
        6,
        `比较 str1[${i - 1}]='${char1}' 和 str2[${j - 1}]='${char2}'`,
        'compare',
        [{ row: i, col: j, status: 'current' }],
        { i, j, char1, char2 }
      );

      if (char1 === char2) {
        // 字符相同，LCS长度+1
        dp[i][j] = dp[i - 1][j - 1] + 1;

        createSnapshot(
          8,
          `字符相同！'${char1}' == '${char2}'\ndp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
          'update',
          [
            { row: i - 1, col: j - 1, status: 'comparing', annotation: '←斜上' },
            { row: i, col: j, status: 'optimal', annotation: dp[i][j].toString() },
          ],
          { i, j, char1, char2, result: dp[i][j] },
          {
            left: { label: char1, value: char1 },
            right: { label: char2, value: char2 },
            result: true,
          }
        );
      } else {
        // 字符不同，取上方或左方的最大值
        const fromTop = dp[i - 1][j];
        const fromLeft = dp[i][j - 1];

        createSnapshot(
          11,
          `字符不同！'${char1}' ≠ '${char2}'\n比较:\n上方: dp[${i - 1}][${j}] = ${fromTop}\n左方: dp[${i}][${j - 1}] = ${fromLeft}`,
          'compare',
          [
            { row: i - 1, col: j, status: 'comparing', annotation: '↑上' },
            { row: i, col: j - 1, status: 'comparing', annotation: '←左' },
            { row: i, col: j, status: 'current' },
          ],
          { i, j, char1, char2, fromTop, fromLeft },
          {
            left: { label: '上方', value: fromTop },
            right: { label: '左方', value: fromLeft },
            result: fromTop >= fromLeft,
          }
        );

        dp[i][j] = Math.max(fromTop, fromLeft);

        createSnapshot(
          13,
          `选择${dp[i][j] === fromTop ? '上方' : '左方'}的值，dp[${i}][${j}] = ${dp[i][j]}`,
          'update',
          [{ row: i, col: j, status: 'selected' }],
          { i, j, result: dp[i][j] }
        );
      }
    }
  }

  // 回溯构造LCS字符串
  let lcs = '';
  let i = m, j = n;
  const pathCells: { row: number; col: number }[] = [];

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs = str1[i - 1] + lcs;
      pathCells.push({ row: i, col: j });
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  createSnapshot(
    15,
    `算法完成！\nLCS长度: ${dp[m][n]}\nLCS字符串: "${lcs}"`,
    'complete',
    [
      { row: m, col: n, status: 'optimal' },
      ...pathCells.map(cell => ({ ...cell, status: 'path' as const })),
    ],
    { lcsLength: dp[m][n], lcs }
  );

  return snapshots;
}

/**
 * 算法快照系统核心类型定义
 * 支持时间旅行调试和逐帧回放
 */

/** 单个格子的状态 */
export interface CellState {
  row: number;
  col: number;
  value: number | string;
  /** 当前格子的状态类型 */
  status: 'default' | 'current' | 'comparing' | 'selected' | 'optimal' | 'path';
  /** 格子的注释（用于解释为什么选择这个值） */
  annotation?: string;
}

/** 二维DP表格 */
export interface DPTable {
  rows: number;
  cols: number;
  cells: CellState[][];
  rowLabels?: string[];
  colLabels?: string[];
}

/** 变量追踪 */
export interface Variable {
  name: string;
  value: any;
  type: string;
  /** 是否在当前步骤被修改 */
  changed?: boolean;
}

/** 算法执行的单个快照 */
export interface AlgorithmSnapshot {
  /** 快照ID（时间戳或递增ID） */
  id: number;
  /** 当前执行的代码行号 */
  currentLine: number;
  /** DP表格状态 */
  dpTable: DPTable;
  /** 当前变量状态 */
  variables: Variable[];
  /** 当前步骤的描述 */
  description: string;
  /** 当前操作类型 */
  operation: 'init' | 'compare' | 'update' | 'decision' | 'complete';
  /** 比较信息（如果是比较操作） */
  comparison?: {
    left: { label: string; value: any };
    right: { label: string; value: any };
    result: boolean;
  };
}

/** 算法元信息 */
export interface AlgorithmMetadata {
  id: string;
  name: string;
  category: 'dp' | 'sort' | 'search' | 'graph' | 'tree';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  /** 算法的伪代码 */
  pseudoCode: string[];
}

/** 算法输入配置 */
export interface AlgorithmInput {
  /** 背包问题：物品重量 */
  weights?: number[];
  /** 背包问题：物品价值 */
  values?: number[];
  /** 背包问题：背包容量 */
  capacity?: number;
  /** LCS问题：字符串1 */
  str1?: string;
  /** LCS问题：字符串2 */
  str2?: string;
}

/** 算法执行状态 */
export interface AlgorithmState {
  /** 当前算法 */
  algorithm: AlgorithmMetadata | null;
  /** 当前算法类型（显式存储，避免通过输入推断） */
  algorithmType: 'knapsack' | 'lcs' | null;
  /** 输入参数 */
  input: AlgorithmInput;
  /** 所有快照 */
  snapshots: AlgorithmSnapshot[];
  /** 当前快照索引 */
  currentSnapshotIndex: number;
  /** 执行状态 */
  status: 'idle' | 'running' | 'paused' | 'completed';
  /** 播放速度（毫秒/帧） */
  speed: number;
}

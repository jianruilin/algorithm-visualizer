import { create } from 'zustand';
import type { AlgorithmState, AlgorithmSnapshot, AlgorithmMetadata, AlgorithmInput } from '../types/algorithm';

interface AlgorithmStore extends AlgorithmState {
  // 操作方法
  setAlgorithm: (algorithm: AlgorithmMetadata) => void;
  setInput: (input: AlgorithmInput) => void;
  setSnapshots: (snapshots: AlgorithmSnapshot[]) => void;

  // 播放控制
  play: () => void;
  pause: () => void;
  reset: () => void;

  // 时间旅行
  goToSnapshot: (index: number) => void;
  nextSnapshot: () => void;
  prevSnapshot: () => void;

  // 速度控制
  setSpeed: (speed: number) => void;

  // 获取当前快照
  getCurrentSnapshot: () => AlgorithmSnapshot | null;
}

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
  // 初始状态
  algorithm: null,
  input: {},
  snapshots: [],
  currentSnapshotIndex: 0,
  status: 'idle',
  speed: 1000, // 默认1秒/帧

  // 设置方法
  setAlgorithm: (algorithm) => set({ algorithm, status: 'idle' }),
  setInput: (input) => set({ input }),
  setSnapshots: (snapshots) => set({
    snapshots,
    currentSnapshotIndex: 0,
    status: 'paused'
  }),

  // 播放控制
  play: () => {
    const state = get();
    if (state.snapshots.length === 0) return;

    set({ status: 'running' });

    // 自动播放逻辑
    const interval = setInterval(() => {
      const currentState = get();

      if (currentState.status !== 'running') {
        clearInterval(interval);
        return;
      }

      if (currentState.currentSnapshotIndex >= currentState.snapshots.length - 1) {
        clearInterval(interval);
        set({ status: 'completed' });
        return;
      }

      currentState.nextSnapshot();
    }, state.speed);
  },

  pause: () => set({ status: 'paused' }),

  reset: () => set({
    currentSnapshotIndex: 0,
    status: 'idle'
  }),

  // 时间旅行
  goToSnapshot: (index) => {
    const state = get();
    if (index >= 0 && index < state.snapshots.length) {
      set({ currentSnapshotIndex: index });
    }
  },

  nextSnapshot: () => {
    const state = get();
    if (state.currentSnapshotIndex < state.snapshots.length - 1) {
      set({ currentSnapshotIndex: state.currentSnapshotIndex + 1 });
    }
  },

  prevSnapshot: () => {
    const state = get();
    if (state.currentSnapshotIndex > 0) {
      set({ currentSnapshotIndex: state.currentSnapshotIndex - 1 });
    }
  },

  setSpeed: (speed) => set({ speed }),

  getCurrentSnapshot: () => {
    const state = get();
    return state.snapshots[state.currentSnapshotIndex] || null;
  },
}));

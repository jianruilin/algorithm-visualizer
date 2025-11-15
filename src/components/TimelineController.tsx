import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useAlgorithmStore } from '../store/algorithmStore';

export function TimelineController() {
  const {
    snapshots,
    currentSnapshotIndex,
    status,
    speed,
    play,
    pause,
    reset,
    nextSnapshot,
    prevSnapshot,
    goToSnapshot,
    setSpeed,
  } = useAlgorithmStore();

  const isPlaying = status === 'running';
  const isCompleted = status === 'completed';
  const canGoNext = currentSnapshotIndex < snapshots.length - 1;
  const canGoPrev = currentSnapshotIndex > 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(e.target.value));
  };

  return (
    <div className="paper p-4">
      <div className="flex flex-col gap-4">
        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={reset}
            disabled={currentSnapshotIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed p-2"
            title="重置到开始"
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={prevSnapshot}
            disabled={!canGoPrev}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed p-2"
            title="上一步"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={handlePlayPause}
            disabled={isCompleted}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed p-3"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={nextSnapshot}
            disabled={!canGoNext}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed p-2"
            title="下一步"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              步骤 {currentSnapshotIndex + 1} / {snapshots.length}
            </span>
            <select
              value={speed}
              onChange={handleSpeedChange}
              className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
            </select>
          </div>

          <input
            type="range"
            min={0}
            max={snapshots.length - 1}
            value={currentSnapshotIndex}
            onChange={(e) => goToSnapshot(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
        </div>

        {/* 状态指示 */}
        <div className="text-center">
          {isCompleted && (
            <span className="text-green-600 font-semibold text-sm">✓ 执行完成</span>
          )}
          {isPlaying && (
            <span className="text-blue-600 font-semibold text-sm">▶ 正在播放...</span>
          )}
        </div>
      </div>
    </div>
  );
}

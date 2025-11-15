import { motion } from 'framer-motion';
import type { AlgorithmSnapshot } from '../types/algorithm';

interface SnapshotInfoProps {
  snapshot: AlgorithmSnapshot | null;
}

export function SnapshotInfo({ snapshot }: SnapshotInfoProps) {
  if (!snapshot) {
    return (
      <div className="paper p-6">
        <p className="text-gray-500 text-center">请选择算法并开始执行</p>
      </div>
    );
  }

  const getOperationBadge = (operation: string) => {
    const badges = {
      init: { color: 'bg-blue-100 text-blue-700', label: '初始化' },
      compare: { color: 'bg-yellow-100 text-yellow-700', label: '比较' },
      update: { color: 'bg-green-100 text-green-700', label: '更新' },
      decision: { color: 'bg-purple-100 text-purple-700', label: '决策' },
      complete: { color: 'bg-gray-100 text-gray-700', label: '完成' },
    };
    const badge = badges[operation as keyof typeof badges] || badges.init;
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* 当前操作描述 */}
      <motion.div
        key={snapshot.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="paper p-4"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800">当前步骤</h3>
          {getOperationBadge(snapshot.operation)}
        </div>
        <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {snapshot.description}
        </p>
      </motion.div>

      {/* 比较信息 */}
      {snapshot.comparison && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="paper p-4 bg-yellow-50"
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-2">比较结果</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex-1">
              <div className="font-mono text-xs text-gray-500">
                {snapshot.comparison.left.label}
              </div>
              <div className="font-bold text-lg">{snapshot.comparison.left.value}</div>
            </div>
            <div className="px-4 text-2xl text-gray-500">
              {snapshot.comparison.result ? '>' : '≤'}
            </div>
            <div className="flex-1 text-right">
              <div className="font-mono text-xs text-gray-500">
                {snapshot.comparison.right.label}
              </div>
              <div className="font-bold text-lg">{snapshot.comparison.right.value}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 变量状态 */}
      <div className="paper p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">变量状态</h3>
        <div className="space-y-2">
          {snapshot.variables.map((variable, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center justify-between text-sm py-1 px-2 rounded ${
                variable.changed ? 'bg-green-50 border-l-2 border-green-500' : ''
              }`}
            >
              <span className="font-mono text-xs text-gray-500">{variable.name}</span>
              <span className="font-mono text-sm font-semibold">{String(variable.value)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

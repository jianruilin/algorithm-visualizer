import { motion } from 'framer-motion';
import type { DPTable } from '../types/algorithm';

interface DPTableVisualizerProps {
  table: DPTable;
}

// 状态到颜色的映射（学术风格）- 提取到组件外部避免重复创建
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'current':
      return 'bg-blue-100 border-blue-500 border-2';
    case 'comparing':
      return 'bg-yellow-50 border-yellow-400 border-2';
    case 'selected':
      return 'bg-green-50 border-green-400 border-2';
    case 'optimal':
      return 'bg-green-100 border-green-600 border-2 font-bold';
    case 'path':
      return 'bg-purple-100 border-purple-500 border-2';
    default:
      return 'bg-white border-gray-200 border';
  }
};

export function DPTableVisualizer({ table }: DPTableVisualizerProps) {
  const { rows, cols, cells, rowLabels, colLabels } = table;

  // 根据表格大小动态计算单元格尺寸
  const cellSize = Math.max(40, Math.min(80, 600 / Math.max(rows, cols)));

  return (
    <div className="paper p-6 overflow-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">DP状态表</h3>

      <div className="inline-block">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-50 font-semibold text-xs p-2">
                i \\ j
              </th>
              {colLabels?.map((label, idx) => (
                <th
                  key={idx}
                  className="border border-gray-300 bg-gray-50 font-semibold text-xs p-2"
                  style={{ minWidth: cellSize, maxWidth: cellSize }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, i) => (
              <tr key={i}>
                <th className="border border-gray-300 bg-gray-50 font-semibold text-xs p-2">
                  {rowLabels?.[i] || i}
                </th>
                {row.map((cell, j) => (
                  <motion.td
                    key={`${i}-${j}`}
                    className={`border text-center font-mono text-sm relative ${getStatusColor(cell.status)}`}
                    style={{ minWidth: cellSize, maxWidth: cellSize, height: cellSize }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: (i * cols + j) * 0.01 }}
                  >
                    <div className="flex items-center justify-center h-full">
                      {cell.value}
                    </div>
                    {cell.annotation && (
                      <motion.div
                        className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md shadow-lg font-semibold z-10 whitespace-nowrap"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {cell.annotation}
                      </motion.div>
                    )}
                  </motion.td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 图例 */}
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500"></div>
          <span>当前单元格</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-400"></div>
          <span>比较中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-600"></div>
          <span>最优解</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500"></div>
          <span>回溯路径</span>
        </div>
      </div>
    </div>
  );
}

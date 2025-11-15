import { useState } from 'react';
import { Play } from 'lucide-react';
import { useAlgorithmStore } from '../store/algorithmStore';
import { knapsackAlgorithm } from '../algorithms/knapsack';
import { lcsAlgorithm } from '../algorithms/lcs';
import type { AlgorithmInput } from '../types/algorithm';

type AlgorithmType = 'knapsack' | 'lcs';

export function InputPanel() {
  const { setInput, setSnapshots, setAlgorithmType, reset } = useAlgorithmStore();
  const [algorithmType, setAlgorithmType_] = useState<AlgorithmType>('knapsack');

  // 背包问题输入
  const [weights, setWeights] = useState('2,3,4,5');
  const [values, setValues] = useState('3,4,5,6');
  const [capacity, setCapacity] = useState('8');

  // LCS输入
  const [str1, setStr1] = useState('ABCBDAB');
  const [str2, setStr2] = useState('BDCAB');

  const handleRun = () => {
    let input: AlgorithmInput;
    let snapshots;

    // 先设置算法类型到 store（显式存储，避免后续通过输入推断）
    setAlgorithmType(algorithmType);

    if (algorithmType === 'knapsack') {
      // 输入验证
      const weightArray = weights.split(',').map((w) => parseInt(w.trim())).filter(n => !isNaN(n));
      const valueArray = values.split(',').map((v) => parseInt(v.trim())).filter(n => !isNaN(n));
      const capacityNum = parseInt(capacity);

      if (weightArray.length === 0 || valueArray.length === 0) {
        alert('请输入有效的数字！');
        return;
      }

      if (weightArray.length !== valueArray.length) {
        alert('物品重量和价值的数量必须相同！');
        return;
      }

      if (isNaN(capacityNum) || capacityNum <= 0) {
        alert('请输入有效的背包容量（大于0的整数）！');
        return;
      }

      input = {
        weights: weightArray,
        values: valueArray,
        capacity: capacityNum,
      };
      snapshots = knapsackAlgorithm(input);
    } else {
      // LCS 输入验证
      if (!str1.trim() || !str2.trim()) {
        alert('请输入两个非空字符串！');
        return;
      }

      input = {
        str1: str1.trim(),
        str2: str2.trim(),
      };
      snapshots = lcsAlgorithm(input);
    }

    setInput(input);
    setSnapshots(snapshots);
    reset();
  };

  return (
    <div className="paper p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">算法配置</h2>

      {/* 算法选择 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          选择算法
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setAlgorithmType_('knapsack')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              algorithmType === 'knapsack'
                ? 'bg-sky-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            0-1背包问题
          </button>
          <button
            onClick={() => setAlgorithmType_('lcs')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              algorithmType === 'lcs'
                ? 'bg-sky-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            最长公共子序列
          </button>
        </div>
      </div>

      {/* 输入表单 */}
      {algorithmType === 'knapsack' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              物品重量（逗号分隔）
            </label>
            <input
              type="text"
              value={weights}
              onChange={(e) => setWeights(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md font-mono text-sm"
              placeholder="2,3,4,5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              物品价值（逗号分隔）
            </label>
            <input
              type="text"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md font-mono text-sm"
              placeholder="3,4,5,6"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              背包容量
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md font-mono text-sm"
              placeholder="8"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              字符串 1
            </label>
            <input
              type="text"
              value={str1}
              onChange={(e) => setStr1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md font-mono text-sm"
              placeholder="ABCBDAB"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              字符串 2
            </label>
            <input
              type="text"
              value={str2}
              onChange={(e) => setStr2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md font-mono text-sm"
              placeholder="BDCAB"
            />
          </div>
        </div>
      )}

      {/* 运行按钮 */}
      <button
        onClick={handleRun}
        className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
      >
        <Play size={18} />
        <span>开始可视化</span>
      </button>

      {/* 算法说明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          {algorithmType === 'knapsack' ? '0-1背包问题' : '最长公共子序列 (LCS)'}
        </h3>
        <p className="text-xs text-blue-800 leading-relaxed">
          {algorithmType === 'knapsack'
            ? '给定n个物品和一个容量为C的背包，每个物品有重量w[i]和价值v[i]，求在不超过背包容量的前提下，能够装入背包的物品的最大价值。'
            : '给定两个序列，找出它们的最长公共子序列（不要求连续）。例如"ABCBDAB"和"BDCAB"的LCS是"BCAB"，长度为4。'}
        </p>
        <div className="mt-2 text-xs text-blue-700">
          <strong>时间复杂度：</strong>{' '}
          {algorithmType === 'knapsack' ? 'O(n×C)' : 'O(m×n)'}
          <br />
          <strong>空间复杂度：</strong>{' '}
          {algorithmType === 'knapsack' ? 'O(n×C)' : 'O(m×n)'}
        </div>
      </div>
    </div>
  );
}

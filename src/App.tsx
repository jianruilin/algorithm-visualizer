import { useAlgorithmStore } from './store/algorithmStore';
import { DPTableVisualizer } from './components/DPTableVisualizer';
import { CodeViewer } from './components/CodeViewer';
import { TimelineController } from './components/TimelineController';
import { SnapshotInfo } from './components/SnapshotInfo';
import { InputPanel } from './components/InputPanel';
import {
  knapsackPythonCode,
  knapsackJavaCode,
  lcsPythonCode,
  lcsJavaCode
} from './data/pseudocode';
import { BookOpen } from 'lucide-react';

function App() {
  const { snapshots, getCurrentSnapshot, input } = useAlgorithmStore();
  const currentSnapshot = getCurrentSnapshot();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 标题栏 */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <BookOpen size={28} className="text-sky-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                算法动画教学系统
              </h1>
              <p className="text-sm text-gray-500">
                动态规划算法可视化 · 逐帧查看执行过程
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* 顶部：输入配置 */}
          <InputPanel />

          {/* 中间：代码查看器（全宽，更清晰） */}
          {currentSnapshot ? (
            <div className="paper p-6">
              <CodeViewer
                pythonCode={input.weights ? knapsackPythonCode : lcsPythonCode}
                javaCode={input.weights ? knapsackJavaCode : lcsJavaCode}
                currentLine={currentSnapshot.currentLine}
              />
            </div>
          ) : (
            <div className="paper p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={32} className="text-sky-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  欢迎使用算法可视化系统
                </h2>
                <p className="text-gray-500 mb-6">
                  在顶部选择算法并配置参数，点击"开始可视化"查看算法执行过程
                </p>
                <div className="text-left bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">功能特点：</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ 逐帧查看算法执行的每一步</li>
                    <li>✓ 实时显示DP表格状态变化</li>
                    <li>✓ 代码行级追踪</li>
                    <li>✓ 时间旅行调试（前进/后退）</li>
                    <li>✓ 详细的变量和比较信息</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 时间线控制器 */}
          {snapshots.length > 0 && <TimelineController />}

          {/* 底部：DP表格可视化 + 步骤说明 */}
          {currentSnapshot && (
            <div className="grid grid-cols-3 gap-6">
              {/* DP表格可视化（占2列，更大） */}
              <div className="col-span-2">
                <DPTableVisualizer table={currentSnapshot.dpTable} />
              </div>

              {/* 步骤说明（占1列） */}
              <div className="col-span-1">
                <SnapshotInfo snapshot={currentSnapshot} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 text-center text-sm text-gray-500">
          <p>算法动画教学系统 · 让复杂的算法变得简单易懂</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

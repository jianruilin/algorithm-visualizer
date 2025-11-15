# 算法动画教学系统

> 一个基于 React + TypeScript 的动态规划算法可视化教学平台，让复杂的算法变得简单易懂

## ✨ 功能特点

- 🎬 **逐帧动画演示** - 查看算法执行的每一步，完整理解算法逻辑
- 📊 **DP 表格可视化** - 实时显示动态规划表格的状态变化
- 💻 **代码行级追踪** - 高亮显示当前执行的代码行，支持 Python 和 Java 双语言
- ⏱️ **时间旅行调试** - 随意前进/后退到任意步骤，支持播放速度调节（0.5x - 4x）
- 🎨 **现代化 UI** - 简洁美观的学术风格界面，支持语法高亮
- 📝 **详细步骤说明** - 每一步都配有详细的文字说明和变量状态

## 🎯 支持的算法

### 1. 0-1 背包问题（Knapsack Problem）
经典的动态规划问题，给定物品重量和价值，在有限容量下求最大价值。

**可视化内容：**
- 初始化 DP 表格
- 逐个处理物品的决策过程
- "放入"与"不放"的比较
- 最优解的回溯路径

### 2. 最长公共子序列（Longest Common Subsequence, LCS）
求两个字符串的最长公共子序列长度。

**可视化内容：**
- 字符逐个比较过程
- 字符相同时的状态转移
- 字符不同时的决策（取上方或左方最大值）
- LCS 字符串的回溯构造

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS v4
- **状态管理**: Zustand
- **动画库**: Framer Motion
- **图标库**: Lucide React

## 📦 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

浏览器访问 `http://localhost:5173` 即可使用。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 📖 使用指南

### 1. 选择算法

在顶部的输入面板中选择要可视化的算法：
- **0-1 背包问题**
- **最长公共子序列 (LCS)**

### 2. 配置参数

**0-1 背包问题：**
- 物品重量：输入以逗号分隔的数字，如 `2,3,4,5`
- 物品价值：输入以逗号分隔的数字，如 `3,4,5,6`
- 背包容量：输入一个正整数，如 `8`

**最长公共子序列：**
- 字符串 1：输入任意字符串，如 `ABCBDAB`
- 字符串 2：输入任意字符串，如 `BDCAB`

### 3. 开始可视化

点击 **"开始可视化"** 按钮，系统将自动生成算法执行的所有步骤。

### 4. 控制播放

- ⏮️ **重置** - 回到第一步
- ⏪ **上一步** - 后退一步
- ▶️ **播放/暂停** - 自动播放动画
- ⏩ **下一步** - 前进一步
- 🎚️ **速度调节** - 调整播放速度（0.5x, 1x, 2x, 4x）

### 5. 查看代码

中间的代码查看器实时显示：
- 当前执行的代码行（高亮显示）
- 支持 Python 和 Java 语言切换
- 完整的语法高亮

### 6. 理解步骤

底部的步骤说明面板显示：
- 当前步骤的文字描述
- 变量的实时状态
- 比较操作的详细信息

## 🏗️ 项目结构

```
algorithm-visualizer/
├── src/
│   ├── algorithms/          # 算法实现
│   │   ├── knapsack.ts      # 0-1背包算法 + 快照生成
│   │   └── lcs.ts           # LCS算法 + 快照生成
│   ├── components/          # React 组件
│   │   ├── CodeViewer.tsx   # 代码查看器（支持语法高亮）
│   │   ├── DPTableVisualizer.tsx  # DP表格可视化
│   │   ├── InputPanel.tsx   # 输入配置面板
│   │   ├── SnapshotInfo.tsx # 步骤说明面板
│   │   └── TimelineController.tsx # 时间线控制器
│   ├── data/                # 数据文件
│   │   └── pseudocode.ts    # Python/Java 代码
│   ├── store/               # 状态管理
│   │   └── algorithmStore.ts # Zustand store
│   ├── types/               # TypeScript 类型定义
│   │   └── algorithm.ts     # 核心类型
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 应用入口
│   └── index.css            # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎓 核心概念

### 快照系统（Snapshot System）

本项目的核心是基于快照的时间旅行调试系统。每个算法执行步骤都会生成一个快照，包含：

```typescript
interface AlgorithmSnapshot {
  id: number;                    // 快照 ID
  currentLine: number;           // 当前代码行
  dpTable: DPTable;              // DP 表格状态
  variables: Variable[];         // 变量状态
  description: string;           // 步骤描述
  operation: OperationType;      // 操作类型
  comparison?: ComparisonInfo;   // 比较信息（可选）
}
```

这种设计使得：
- ✅ 可以随意前进/后退到任意步骤
- ✅ 完整保留算法执行的所有状态
- ✅ 支持暂停、播放、变速等功能
- ✅ 便于教学和调试

### 动态规划可视化

DP 表格使用颜色编码不同的状态：

- 🔵 **蓝色边框** - 当前正在处理的单元格
- 🟡 **黄色边框** - 正在比较的单元格
- 🟢 **绿色边框** - 最优解
- 🟣 **紫色边框** - 回溯路径

### 语法高亮

自定义实现的语法高亮器，支持：
- 关键字（紫色）
- 字符串（绿色）
- 数字（橙色）
- 注释（灰色斜体）
- 函数定义（青色）

## 🤝 贡献指南

欢迎贡献代码、报告 Bug 或提出新功能建议！

### 添加新算法

1. 在 `src/algorithms/` 创建新的算法文件
2. 实现算法逻辑并生成快照
3. 在 `src/data/pseudocode.ts` 添加代码
4. 在 `InputPanel.tsx` 添加输入配置
5. 更新 README.md

### 代码规范

- 使用 TypeScript
- 遵循 React Hooks 最佳实践
- 保持代码简洁和可读性
- 添加必要的注释

## 📄 开源协议

MIT License

Copyright (c) 2025

## 🙏 致谢

- [React](https://react.dev/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 样式方案
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Zustand](https://github.com/pmndrs/zustand) - 状态管理

---

⭐ 如果这个项目对你有帮助，欢迎 Star 支持！

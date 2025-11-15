import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

interface CodeViewerProps {
  pythonCode: string[];
  javaCode: string[];
  currentLine: number;
}

type Language = 'python' | 'java';

export function CodeViewer({ pythonCode, javaCode, currentLine }: CodeViewerProps) {
  const [language, setLanguage] = useState<Language>('python');
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const code = language === 'python' ? pythonCode : javaCode;

  // 平滑滚动到当前行（仅在容器内滚动，不影响页面）
  useEffect(() => {
    const container = containerRef.current;
    const lineElement = lineRefs.current.get(currentLine);

    if (container && lineElement) {
      const containerRect = container.getBoundingClientRect();
      const lineRect = lineElement.getBoundingClientRect();

      const isVisible =
        lineRect.top >= containerRect.top &&
        lineRect.bottom <= containerRect.bottom;

      if (!isVisible) {
        const scrollTop = lineElement.offsetTop - container.offsetTop - container.clientHeight / 2 + lineElement.clientHeight / 2;
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [currentLine]);

  // 使用 Prism.js 进行语法高亮
  const highlightCode = (line: string): { __html: string } => {
    if (!line.trim()) {
      return { __html: '<span class="text-gray-300">　</span>' };
    }

    try {
      const grammar = language === 'python' ? Prism.languages.python : Prism.languages.java;
      const highlighted = Prism.highlight(line, grammar, language);
      return { __html: highlighted };
    } catch (error) {
      // 如果高亮失败，返回原始文本
      return { __html: `<span class="text-gray-300">${line}</span>` };
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">算法代码</h3>

        {/* 语言切换按钮 */}
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('python')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              language === 'python'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Python
          </button>
          <button
            onClick={() => setLanguage('java')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              language === 'java'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Java
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative bg-gray-900 rounded-xl overflow-auto shadow-lg code-viewer"
        style={{ height: '500px' }}
      >
        <div className="p-8">
          {code.map((line, idx) => {
            const lineNumber = idx + 1;
            const isCurrentLine = lineNumber === currentLine;

            return (
              <div
                key={idx}
                ref={(el) => {
                  if (el) lineRefs.current.set(lineNumber, el);
                }}
                className={`relative flex items-start py-3 ${
                  isCurrentLine ? 'bg-blue-900/40' : ''
                }`}
              >
                {/* 当前行指示器 */}
                {isCurrentLine && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-400 rounded-r"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* 行号 */}
                <div
                  className={`w-20 flex-shrink-0 text-right pr-6 select-none text-sm ${
                    isCurrentLine ? 'text-blue-400 font-bold' : 'text-gray-600'
                  }`}
                >
                  {lineNumber}
                </div>

                {/* 代码内容（使用 Prism.js 高亮） */}
                <div
                  className="flex-1 font-mono text-[16px] leading-loose whitespace-pre"
                  dangerouslySetInnerHTML={highlightCode(line)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

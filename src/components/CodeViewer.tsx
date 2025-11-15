import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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

  // 增强的语法高亮函数
  const highlightCode = (line: string) => {
    const trimmed = line.trim();

    // 空行
    if (trimmed === '') {
      return <span className="text-gray-300">{line || '　'}</span>;
    }

    // Python 注释 (#) 或 Java 注释 (//)
    if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
      return <span className="text-gray-500 italic">{line}</span>;
    }

    // 文档字符串
    if (trimmed.startsWith('"""') || trimmed.startsWith('/**') || trimmed.startsWith('*')) {
      return <span className="text-gray-500 italic">{line}</span>;
    }

    // 函数/方法定义
    if (language === 'python' && trimmed.startsWith('def ')) {
      return <span className="text-cyan-400 font-semibold">{line}</span>;
    }
    if (language === 'java' && (trimmed.includes('public ') || trimmed.includes('private ') || trimmed.includes('static '))) {
      return <span className="text-cyan-400 font-semibold">{line}</span>;
    }

    // 类定义
    if (trimmed.startsWith('class ') || trimmed.startsWith('public class ')) {
      return <span className="text-yellow-400 font-bold">{line}</span>;
    }

    // 关键字和符号高亮
    const pythonKeywords = ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'in', 'range', 'len', 'max', 'min', 'append', 'reversed', 'join'];
    const javaKeywords = ['public', 'private', 'static', 'class', 'if', 'else', 'for', 'while', 'return', 'int', 'String', 'void', 'new', 'Math'];
    const keywords = language === 'python' ? pythonKeywords : javaKeywords;

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    // 字符串匹配
    const stringRegex = language === 'python'
      ? /(['"])(?:(?=(\\?))\2.)*?\1|f(['"])(?:(?=(\\?))\4.)*?\3/g
      : /(["'])(?:(?=(\\?))\2.)*?\1/g;
    const strings: { start: number; end: number; text: string }[] = [];
    let match: RegExpExecArray | null;

    while ((match = stringRegex.exec(line)) !== null) {
      strings.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
    }

    // 数字匹配
    const numberRegex = /\b\d+\b/g;
    const numbers: { start: number; end: number; text: string }[] = [];
    while ((match = numberRegex.exec(line)) !== null) {
      const inString = strings.some(s => match!.index >= s.start && match!.index < s.end);
      if (!inString) {
        numbers.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
      }
    }

    // 关键字匹配
    const keywordMatches: { start: number; end: number; text: string }[] = [];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      while ((match = regex.exec(line)) !== null) {
        const inString = strings.some(s => match!.index >= s.start && match!.index < s.end);
        if (!inString) {
          keywordMatches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
        }
      }
    });

    // 合并所有匹配
    const allMatches = [...strings, ...numbers, ...keywordMatches].sort((a, b) => a.start - b.start);

    // 构建高亮 JSX
    allMatches.forEach((m, i) => {
      if (m.start > lastIndex) {
        parts.push(<span key={`text-${i}`} className="text-gray-300">{line.slice(lastIndex, m.start)}</span>);
      }

      let className = 'text-gray-300';
      if (strings.includes(m)) {
        className = 'text-green-400';
      } else if (numbers.includes(m)) {
        className = 'text-orange-400';
      } else if (keywordMatches.includes(m)) {
        className = 'text-purple-400';
      }

      parts.push(<span key={`highlight-${i}`} className={className}>{m.text}</span>);
      lastIndex = m.end;
    });

    if (lastIndex < line.length) {
      parts.push(<span key="text-end" className="text-gray-300">{line.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? <>{parts}</> : <span className="text-gray-300">{line}</span>;
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
        className="relative bg-gray-900 rounded-xl overflow-auto shadow-lg"
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

                {/* 代码内容（带高亮） */}
                <div className="flex-1 font-mono text-[16px] leading-loose whitespace-pre">
                  {line ? highlightCode(line) : <span className="text-gray-500">　</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownViewProps {
  children: string;
}

// remark-math only recognizes `$...$` / `$$...$$`. LLM output often uses the
// LaTeX-native `\(...\)` and `\[...\]` delimiters, so normalize those first.
function normalizeMath(md: string): string {
  return md
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, expr) => `$$${expr}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, expr) => `$${expr}$`);
}

// Memoized: markdown + KaTeX parsing is expensive. Without this, a parent
// re-render (e.g. the drawer's 1s visual timer) would re-parse and re-render
// all math every tick, blocking the main thread.
function MarkdownView({ children }: MarkdownViewProps) {
  const normalized = useMemo(() => normalizeMath(children), [children]);
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {normalized}
    </ReactMarkdown>
  );
}

export default memo(MarkdownView);

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

export default function MarkdownView({ children }: MarkdownViewProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {normalizeMath(children)}
    </ReactMarkdown>
  );
}

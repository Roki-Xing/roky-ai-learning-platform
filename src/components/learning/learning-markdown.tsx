import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function LearningMarkdown(props: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("learning-markdown text-sm leading-7 text-muted-foreground", props.className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => (
            <h2 className="mb-3 mt-5 text-xl font-semibold leading-snug text-foreground first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 mt-5 text-lg font-semibold leading-snug text-foreground first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-2 mt-4 text-base font-semibold leading-snug text-foreground first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="my-2">{children}</p>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-indigo-300 bg-indigo-50/40 px-3 py-2 text-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) {
              return (
                <code className={cn("block whitespace-pre-wrap break-words text-xs leading-6", className)}>
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-3 overflow-x-auto rounded-lg border bg-muted/40 p-3">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[520px] border-collapse text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/60 text-foreground">{children}</thead>,
          th: ({ children }) => <th className="border-b px-3 py-2 font-medium">{children}</th>,
          td: ({ children }) => <td className="border-t px-3 py-2 align-top">{children}</td>,
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
              className="font-medium text-indigo-700 underline-offset-4 hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {props.content}
      </ReactMarkdown>
    </div>
  );
}

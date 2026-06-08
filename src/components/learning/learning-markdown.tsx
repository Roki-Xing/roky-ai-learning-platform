import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { LearningCodeBlock } from "@/components/learning/learning-code-block";
import { cn } from "@/lib/utils";

type LearningCalloutKind =
  | "intuition"
  | "mistake"
  | "key_point"
  | "example"
  | "code_sketch"
  | "diagram"
  | "experiment"
  | "self_check";

const learningCallouts = {
  intuition: {
    label: "核心直觉",
    className: "border-emerald-300 bg-emerald-50/60 text-emerald-950",
  },
  mistake: {
    label: "常见误区",
    className: "border-rose-300 bg-rose-50/60 text-rose-950",
  },
  key_point: {
    label: "重点",
    className: "border-indigo-300 bg-indigo-50/60 text-indigo-950",
  },
  example: {
    label: "例子",
    className: "border-sky-300 bg-sky-50/60 text-sky-950",
  },
  code_sketch: {
    label: "代码/伪代码",
    className: "border-zinc-300 bg-zinc-50/70 text-zinc-950",
  },
  diagram: {
    label: "图示",
    className: "border-teal-300 bg-teal-50/60 text-teal-950",
  },
  experiment: {
    label: "互动实验",
    className: "border-violet-300 bg-violet-50/60 text-violet-950",
  },
  self_check: {
    label: "自测",
    className: "border-amber-300 bg-amber-50/60 text-amber-950",
  },
} satisfies Record<LearningCalloutKind, { label: string; className: string }>;

function childrenToText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return childrenToText(child.props.children);
      }
      return "";
    })
    .join("");
}

function detectLearningCallout(text: string): LearningCalloutKind | null {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (/^核心直觉[:：]/.test(normalized)) return "intuition";
  if (/^常见误区[:：]/.test(normalized)) return "mistake";
  if (/^(重点|要点|关键点|Key point)[:：]/i.test(normalized)) return "key_point";
  if (/^(例子卡|例子|示例|Example)[:：]/i.test(normalized)) return "example";
  if (/^(代码\/伪代码|伪代码|代码草图|Code\/Pseudocode)[:：]/i.test(normalized)) return "code_sketch";
  if (/^(图示|概念图|视觉化|Diagram)[:：]/i.test(normalized)) return "diagram";
  if (/^(互动实验|小实验|动手试试|Experiment)[:：]/i.test(normalized)) return "experiment";
  if (/^(自测卡|自测|小测|Self[- ]?check)[:：]/i.test(normalized)) return "self_check";
  return null;
}

export function LearningMarkdown(props: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("learning-markdown text-sm leading-7 text-muted-foreground", props.className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
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
          blockquote: ({ children }) => {
            const calloutKind = detectLearningCallout(childrenToText(children));
            if (!calloutKind) {
              return (
                <blockquote className="my-3 border-l-2 border-indigo-300 bg-indigo-50/40 px-3 py-2 text-foreground">
                  {children}
                </blockquote>
              );
            }
            const callout = learningCallouts[calloutKind];
            return (
              <blockquote
                data-learning-callout={calloutKind}
                className={cn("my-3 rounded-lg border-l-4 px-3 py-2 text-foreground", callout.className)}
              >
                <div className="text-xs font-semibold">{callout.label}</div>
                <div className="[&>p:first-child]:mt-1 [&>p:last-child]:mb-0">{children}</div>
              </blockquote>
            );
          },
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
            <LearningCodeBlock code={childrenToText(children)}>
              {children}
            </LearningCodeBlock>
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

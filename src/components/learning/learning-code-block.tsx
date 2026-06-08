"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LearningCodeBlock(props: {
  code: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between gap-3 border-b bg-background/70 px-3 py-2">
        <div className="text-xs font-medium text-muted-foreground">代码</div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          data-copy-code="true"
          onClick={handleCopy}
          className="min-h-11 gap-1.5 px-3 text-xs"
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          {copied ? "已复制" : "复制代码"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3">{props.children}</pre>
    </div>
  );
}

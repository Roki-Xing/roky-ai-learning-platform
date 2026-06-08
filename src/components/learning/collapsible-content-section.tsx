"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function CollapsibleContentSection(props: {
  id: string;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const contentId = `${props.id}-panel`;
  const toggleId = `${props.id}-toggle`;

  useEffect(() => {
    function syncWithHash() {
      const hash = window.location.hash;
      if (hash === `#${props.id}` || hash === `#${props.id}-toggle`) {
        setOpen(true);
      }
    }

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, [props.id]);

  return (
    <section id={props.id} className={cn("grid gap-3", props.className)}>
      <button
        id={toggleId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-4 py-3 text-left"
      >
        <div>
          <div className="text-sm font-medium">{open ? "收起完整课程内容" : props.title}</div>
          {props.description ? (
            <div className="mt-1 text-xs text-muted-foreground">{props.description}</div>
          ) : null}
        </div>
        {open ? (
          <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open ? (
        <div id={contentId} role="region" aria-labelledby={toggleId}>
          {props.children}
        </div>
      ) : null}
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export type LearningEmptyAction = {
  href: string;
  label: string;
  variant?: "default" | "secondary" | "outline";
};

export function LearningEmptyState(props: {
  title: string;
  description?: string;
  actions?: LearningEmptyAction[];
}) {
  return (
    <div className="grid gap-3 rounded-lg border bg-muted/20 p-4">
      <div>
        <div className="text-sm font-medium">{props.title}</div>
        {props.description ? (
          <div className="mt-1 text-sm text-muted-foreground">{props.description}</div>
        ) : null}
      </div>
      {props.actions?.length ? (
        <div className="flex flex-wrap gap-2">
          {props.actions.map((a) => (
            <Button key={a.href} asChild size="sm" variant={a.variant ?? "secondary"}>
              <Link href={a.href}>{a.label}</Link>
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}


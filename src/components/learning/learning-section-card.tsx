import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LearningSectionCard(props: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-lg shadow-sm", props.className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{props.title}</CardTitle>
            {props.description ? (
              <div className="mt-1 text-xs text-muted-foreground">{props.description}</div>
            ) : null}
          </div>
          {props.action ? <div className="shrink-0">{props.action}</div> : null}
        </div>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}


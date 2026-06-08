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
        <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-base">{props.title}</CardTitle>
            {props.description ? (
              <div className="mt-1 text-xs text-muted-foreground">{props.description}</div>
            ) : null}
          </div>
          {props.action ? <div className="w-full sm:w-auto sm:shrink-0">{props.action}</div> : null}
        </div>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}

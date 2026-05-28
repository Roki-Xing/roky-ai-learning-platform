import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LearningMetricCard(props: {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-lg shadow-sm", props.className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="text-2xl font-semibold tabular-nums">{props.value}</div>
        {props.subtitle ? (
          <div className="mt-1 text-xs text-muted-foreground">{props.subtitle}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}


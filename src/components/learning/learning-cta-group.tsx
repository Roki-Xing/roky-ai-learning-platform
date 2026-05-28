import { cn } from "@/lib/utils";

export function LearningCTAGroup(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", props.className)}>
      {props.children}
    </div>
  );
}


import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { cn } from "@/lib/utils";

export type NotesListPanelItem = {
  id: string;
  title: string;
  content: string;
  updatedAtLabel: string;
  lessonId: string | null;
  lessonTitle: string | null;
};

export function NotesListPanel(props: {
  notes: NotesListPanelItem[];
  selectedNoteId?: string | null;
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">笔记列表</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {props.notes.length ? (
          <div className="grid gap-1">
            {props.notes.map((note) => {
              const isSelected = note.id === props.selectedNoteId;
              return (
                <Link
                  key={note.id}
                  href={`/notes?noteId=${encodeURIComponent(note.id)}`}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left transition-colors",
                    isSelected ? "border-indigo-200 bg-indigo-50" : "hover:bg-muted/50",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0 text-sm font-medium">{note.title}</div>
                    {isSelected ? (
                      <LearningStatusBadge tone="info">来自语音笔记的当前笔记</LearningStatusBadge>
                    ) : null}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {note.updatedAtLabel}
                    {note.lessonId ? (
                      <>
                        {" "}
                        /{" "}
                        <span className="underline underline-offset-4">
                          {note.lessonTitle ?? "关联课程"}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs text-muted-foreground">
                    {note.content}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            暂无笔记。你可以先去 /today 完成学习，然后在这里沉淀总结。
          </div>
        )}
      </CardContent>
    </Card>
  );
}

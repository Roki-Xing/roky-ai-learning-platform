"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Flashcard } from "@prisma/client";
import { rateFlashcardAction } from "@/server/review/actions";

export function ReviewCard(props: { card: Flashcard; queueSize: number }) {
  const { card, queueSize } = props;
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mt-3 grid gap-3">
      <div className="rounded-md border p-3">
        <div className="text-sm font-medium">{card.front}</div>
        {revealed ? (
          <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {card.back}
          </div>
        ) : (
          <div className="mt-2 text-xs text-muted-foreground">
            点击“显示答案”后再评分
          </div>
        )}
      </div>

      {!revealed ? (
        <Button type="button" variant="secondary" onClick={() => setRevealed(true)}>
          显示答案
        </Button>
      ) : (
        <form action={rateFlashcardAction} className="flex flex-wrap gap-2">
          <input type="hidden" name="flashcardId" value={card.id} />
          <Button type="submit" name="rating" value="forgot" variant="secondary">
            忘了（+1d）
          </Button>
          <Button type="submit" name="rating" value="hard" variant="secondary">
            模糊（+3d）
          </Button>
          <Button type="submit" name="rating" value="good" variant="secondary">
            记得（+7d）
          </Button>
          <Button type="submit" name="rating" value="easy" variant="secondary">
            很熟（+14d）
          </Button>
        </form>
      )}

      <div className="text-xs text-muted-foreground">
        队列：{queueSize} 张（仅展示到期卡片）
      </div>
    </div>
  );
}

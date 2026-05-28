"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import type { Flashcard } from "@prisma/client";
import { rateFlashcardAction } from "@/server/review/actions";

export function ReviewCard(props: { card: Flashcard; queueSize: number }) {
  const { card, queueSize } = props;
  const [revealed, setRevealed] = useState(false);
  const [lastRating, setLastRating] = useState<null | "forgot" | "hard" | "good" | "easy">(null);

  const progress = useMemo(() => {
    // We only know queueSize and current card; treat it as 1 of N.
    // The surrounding page can later pass richer queue metadata.
    if (!queueSize || queueSize <= 0) return 0;
    return 1 / queueSize;
  }, [queueSize]);

  useEffect(() => {
    setRevealed(false);
    setLastRating(null);
  }, [card.id]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (!revealed) return;
      const mapping: Record<string, "forgot" | "hard" | "good" | "easy"> = {
        "1": "forgot",
        "2": "hard",
        "3": "good",
        "4": "easy",
      };
      const rating = mapping[e.key];
      if (!rating) return;
      const form = document.getElementById("review-rate-form") as HTMLFormElement | null;
      if (!form) return;
      const ratingInput = form.querySelector("input[name='rating']") as HTMLInputElement | null;
      if (!ratingInput) return;
      ratingInput.value = rating;
      setLastRating(rating);
      form.requestSubmit();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revealed]);

  return (
    <div className="mt-3 grid gap-3">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div>队列：{queueSize} 张</div>
            {card.type ? (
              <LearningStatusBadge tone="neutral">{card.type}</LearningStatusBadge>
            ) : null}
            {lastRating ? (
              <LearningStatusBadge tone="info">已提交：{lastRating}</LearningStatusBadge>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground">
            Space 显示答案；1-4 评分
          </div>
        </div>
        <LearningProgressBar value={progress} />
      </div>

      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="text-base font-semibold leading-snug">{card.front}</div>
        {revealed ? (
          <div className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
            {card.back}
          </div>
        ) : (
          <div className="mt-3 text-sm text-muted-foreground">
            先在脑中回答，再显示答案。
          </div>
        )}
      </div>

      {!revealed ? (
        <Button type="button" variant="secondary" onClick={() => setRevealed(true)}>
          显示答案
        </Button>
      ) : (
        <form
          id="review-rate-form"
          action={rateFlashcardAction}
          className="flex flex-wrap items-center gap-2"
        >
          <input type="hidden" name="flashcardId" value={card.id} />
          <input type="hidden" name="rating" value="" />
          <Button
            type="submit"
            name="rating"
            value="forgot"
            variant="secondary"
            className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          >
            1 忘了（+1d）
          </Button>
          <Button
            type="submit"
            name="rating"
            value="hard"
            variant="secondary"
            className="border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
          >
            2 模糊（+3d）
          </Button>
          <Button
            type="submit"
            name="rating"
            value="good"
            variant="secondary"
            className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          >
            3 记得（+7d）
          </Button>
          <Button
            type="submit"
            name="rating"
            value="easy"
            variant="secondary"
            className="border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            4 很熟（+14d）
          </Button>
        </form>
      )}
    </div>
  );
}

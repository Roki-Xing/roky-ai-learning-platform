"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningEmptyState } from "@/components/learning/learning-empty-state";
import { rateFlashcardAction } from "@/server/review/actions";
import {
  buildReviewSessionSummary,
  type ReviewSessionCounts,
} from "@/server/review/session-summary";

export type ReviewCardDto = {
  id: string;
  front: string;
  back: string;
  type: string | null;
};

export type ReviewEmptyState = {
  title: string;
  description?: string;
  actions: Array<{ href: string; label: string }>;
};

type Rating = "forgot" | "hard" | "good" | "easy";

function clamp01(x: number) {
  if (!Number.isFinite(x)) return 0;
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return x;
}

function ReviewCardStage(props: {
  card: ReviewCardDto;
  onRated: (rating: Rating) => void;
}) {
  const { card, onRated } = props;
  const [revealed, setRevealed] = useState(false);
  const [lastRating, setLastRating] = useState<Rating | null>(null);

  const submitRating = useCallback(
    (rating: Rating) => {
      if (lastRating) return;
      setLastRating(rating);
      onRated(rating);
      const form = document.getElementById("review-rate-form") as HTMLFormElement | null;
      const ratingInput = form?.querySelector("input[name='rating']") as HTMLInputElement | null;
      if (!form || !ratingInput) return;
      ratingInput.value = rating;
      form.requestSubmit();
    },
    [lastRating, onRated],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (!revealed) return;
      const mapping: Record<string, Rating> = {
        "1": "forgot",
        "2": "hard",
        "3": "good",
        "4": "easy",
      };
      const rating = mapping[e.key];
      if (!rating) return;
      submitRating(rating);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revealed, submitRating]);

  return (
    <>
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="text-base font-semibold leading-snug">{card.front}</div>
        {revealed ? (
          <div className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
            {card.back}
          </div>
        ) : (
          <div className="mt-3 text-sm text-muted-foreground">先在脑中回答，再显示答案。</div>
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
            type="button"
            variant="secondary"
            className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            onClick={() => submitRating("forgot")}
            disabled={Boolean(lastRating)}
          >
            1 忘了（+1d）
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
            onClick={() => submitRating("hard")}
            disabled={Boolean(lastRating)}
          >
            2 模糊（+3d）
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            onClick={() => submitRating("good")}
            disabled={Boolean(lastRating)}
          >
            3 记得（+7d）
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            onClick={() => submitRating("easy")}
            disabled={Boolean(lastRating)}
          >
            4 很熟（+14d）
          </Button>
        </form>
      )}
    </>
  );
}

export function ReviewTrainer(props: {
  card: ReviewCardDto | null;
  queueSize: number;
  emptyState: ReviewEmptyState;
  initialSessionCounts?: ReviewSessionCounts;
}) {
  const { card, queueSize, emptyState, initialSessionCounts } = props;
  const initialReviewed = initialSessionCounts
    ? Object.values(initialSessionCounts).reduce((a, b) => a + b, 0)
    : 0;
  const [sessionTotal, setSessionTotal] = useState(() => queueSize + initialReviewed);
  const [lastRating, setLastRating] = useState<Rating | null>(null);
  const [sessionCounts, setSessionCounts] = useState<Record<Rating, number>>({
    forgot: initialSessionCounts?.forgot ?? 0,
    hard: initialSessionCounts?.hard ?? 0,
    good: initialSessionCounts?.good ?? 0,
    easy: initialSessionCounts?.easy ?? 0,
  });

  const handleRated = useCallback(
    (rating: Rating) => {
      setLastRating(rating);
      setSessionCounts((prev) => ({ ...prev, [rating]: (prev[rating] ?? 0) + 1 }));
      setSessionTotal((prev) => Math.max(prev, queueSize));
    },
    [queueSize],
  );

  const progress = useMemo(() => {
    if (!sessionTotal) return 0;
    const reviewed = Math.max(0, sessionTotal - queueSize);
    return clamp01(reviewed / sessionTotal);
  }, [queueSize, sessionTotal]);

  const indexLabel = useMemo(() => {
    if (!sessionTotal || !queueSize) return null;
    const idx = Math.min(sessionTotal, Math.max(1, sessionTotal - queueSize + 1));
    return `${idx} / ${sessionTotal}`;
  }, [queueSize, sessionTotal]);

  const sessionReviewed = Object.values(sessionCounts).reduce((a, b) => a + b, 0);
  const sessionSummary = buildReviewSessionSummary(sessionCounts);
  const sessionHasStarted = sessionTotal > 0 || sessionReviewed > 0;
  const sessionComplete = sessionHasStarted && queueSize === 0;

  return (
    <div className="mt-3 grid gap-3">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div>队列：{queueSize} 张</div>
            {indexLabel ? <div>进度：{indexLabel}</div> : null}
            {card?.type ? <LearningStatusBadge tone="neutral">{card.type}</LearningStatusBadge> : null}
            {lastRating ? (
              <LearningStatusBadge tone="info">已提交：{lastRating}</LearningStatusBadge>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground">Space 显示答案；1-4 评分</div>
        </div>
        <LearningProgressBar value={progress} />
      </div>

      {card ? (
        <ReviewCardStage key={card.id} card={card} onRated={handleRated} />
      ) : sessionComplete ? (
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-base font-semibold">{sessionSummary.title}</div>
            <LearningStatusBadge tone={sessionSummary.tone}>
              留存 {sessionSummary.retentionRate}%
            </LearningStatusBadge>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {sessionSummary.description}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-md border bg-muted/20 px-3 py-2">
              <div className="text-xs text-muted-foreground">本轮复习</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {sessionSummary.reviewedCount}
              </div>
            </div>
            <div className="rounded-md border bg-emerald-50 px-3 py-2 text-emerald-800">
              <div className="text-xs">稳定记住</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {sessionSummary.retainedCount}
              </div>
            </div>
            <div className="rounded-md border bg-amber-50 px-3 py-2 text-amber-900">
              <div className="text-xs">需要补弱</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {sessionSummary.weakCount}
              </div>
            </div>
          </div>
          <div className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-4">
            <div>忘了：{sessionCounts.forgot}</div>
            <div>模糊：{sessionCounts.hard}</div>
            <div>记得：{sessionCounts.good}</div>
            <div>很熟：{sessionCounts.easy}</div>
          </div>
          <div className="mt-4 rounded-lg border bg-muted/20 p-3">
            <div className="text-sm font-medium">复习后行动计划</div>
            <div className="mt-3 grid gap-2">
              {sessionSummary.actionPlan.map((item, index) => (
                <div key={item.title} className="flex gap-3 rounded-md border bg-background px-3 py-2">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <a href={sessionSummary.primaryAction.href}>{sessionSummary.primaryAction.label}</a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={sessionSummary.secondaryAction.href}>
                {sessionSummary.secondaryAction.label}
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <LearningEmptyState
          title={emptyState.title}
          description={emptyState.description}
          actions={emptyState.actions.map((a) => ({
            href: a.href,
            label: a.label,
            variant: "secondary",
          }))}
        />
      )}
    </div>
  );
}

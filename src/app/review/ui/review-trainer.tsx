"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningCelebrationCue } from "@/components/learning/learning-celebration-cue";
import { LearningEmptyState } from "@/components/learning/learning-empty-state";
import { rateFlashcardAction } from "@/server/review/actions";
import {
  buildReviewSessionSummary,
  type ReviewSessionCounts,
  type ReviewSessionRatedCard,
} from "@/server/review/session-summary";

export type ReviewCardDto = {
  id: string;
  front: string;
  back: string;
  type: string | null;
  tags?: string[];
  lessonTitle?: string | null;
  topicTitle?: string | null;
};

export type ReviewEmptyState = {
  title: string;
  description?: string;
  actions: Array<{ href: string; label: string }>;
};

type Rating = "forgot" | "hard" | "good" | "easy";

const ratingOptions: Array<{
  rating: Rating;
  label: string;
  interval: string;
  className: string;
}> = [
  {
    rating: "forgot",
    label: "忘了",
    interval: "+1d",
    className: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  },
  {
    rating: "hard",
    label: "模糊",
    interval: "+3d",
    className: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100",
  },
  {
    rating: "good",
    label: "记得",
    interval: "+7d",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  {
    rating: "easy",
    label: "很熟",
    interval: "+14d",
    className: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  },
];

const reviewCardTypeLabels: Record<string, string> = {
  algorithm: "算法卡",
  benchmark: "Radar 卡",
  code: "代码思路卡",
  code_bug: "代码反馈卡",
  concept: "概念卡",
  misconception: "误区卡",
  mistake: "错题卡",
  project: "项目卡",
  quiz_error: "错题卡",
  term: "术语卡",
};

function formatReviewCardTypeLabel(type: string | null) {
  if (!type) return null;
  return reviewCardTypeLabels[type] ?? "复习卡";
}

function clamp01(x: number) {
  if (!Number.isFinite(x)) return 0;
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return x;
}

function subscribeToHydration(callback: () => void) {
  const frame = window.requestAnimationFrame(callback);
  return () => window.cancelAnimationFrame(frame);
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export function ReviewRatingControls(props: {
  disabled: boolean;
  onRating: (rating: Rating) => void;
}) {
  return (
    <div role="group" aria-label="复习评分" className="grid gap-2 sm:grid-cols-4">
      {ratingOptions.map((option) => (
        <Button
          key={option.rating}
          type="button"
          variant="secondary"
          className={`min-h-12 justify-start text-left sm:justify-center sm:text-center ${option.className}`}
          onClick={() => props.onRating(option.rating)}
          disabled={props.disabled}
        >
          <span className="grid min-w-0 gap-0.5">
            <span className="font-medium leading-tight">{option.label}</span>
            <span className="text-xs leading-tight opacity-80">{option.interval}</span>
          </span>
        </Button>
      ))}
    </div>
  );
}

function ReviewCardStage(props: {
  card: ReviewCardDto;
  onRated: (rating: Rating) => void;
}) {
  const { card, onRated } = props;
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
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
    <div className="mx-auto grid w-full max-w-2xl gap-3">
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

      <div
        aria-label="复习移动操作"
        className="sticky bottom-16 z-20 rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none"
      >
        {!revealed ? (
          <Button
            type="button"
            variant="secondary"
            disabled={!isHydrated}
            className="min-h-12 w-full sm:w-auto"
            onClick={() => setRevealed(true)}
          >
            显示答案
          </Button>
        ) : (
          <form
            id="review-rate-form"
            action={rateFlashcardAction}
            className="grid gap-2"
          >
            <input type="hidden" name="flashcardId" value={card.id} />
            <input type="hidden" name="rating" value="" />
            <ReviewRatingControls disabled={Boolean(lastRating)} onRating={submitRating} />
          </form>
        )}
      </div>
    </div>
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
  const [ratedCards, setRatedCards] = useState<ReviewSessionRatedCard[]>([]);

  const handleRated = useCallback(
    (rating: Rating) => {
      setLastRating(rating);
      setSessionCounts((prev) => ({ ...prev, [rating]: (prev[rating] ?? 0) + 1 }));
      setSessionTotal((prev) => Math.max(prev, queueSize));
      if (card) {
        setRatedCards((prev) => {
          const next = prev.filter((entry) => entry.id !== card.id);
          return [
            ...next,
            {
              id: card.id,
              front: card.front,
              rating,
              type: card.type,
              tags: card.tags ?? [],
              lessonTitle: card.lessonTitle ?? null,
              topicTitle: card.topicTitle ?? null,
            },
          ];
        });
      }
    },
    [card, queueSize],
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
  const sessionSummary = buildReviewSessionSummary(sessionCounts, ratedCards);
  const sessionHasStarted = sessionTotal > 0 || sessionReviewed > 0;
  const sessionComplete = sessionHasStarted && queueSize === 0;
  const cardTypeLabel = formatReviewCardTypeLabel(card?.type ?? null);

  return (
    <div className="mt-3 grid gap-3">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div>队列：{queueSize} 张</div>
            {indexLabel ? <div>进度：{indexLabel}</div> : null}
            {cardTypeLabel ? (
              <LearningStatusBadge tone="neutral">{cardTypeLabel}</LearningStatusBadge>
            ) : null}
            {lastRating ? (
              <LearningStatusBadge tone="info">已提交：{lastRating}</LearningStatusBadge>
            ) : null}
          </div>
          <div className="hidden text-xs text-muted-foreground sm:block">
            电脑快捷键：Space 显示答案；1-4 评分
          </div>
        </div>
        <LearningProgressBar value={progress} label="复习队列进度" />
      </div>

      {card ? (
        <ReviewCardStage key={card.id} card={card} onRated={handleRated} />
      ) : sessionComplete ? (
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <LearningCelebrationCue
            kind="review_cleared"
            metric={`${sessionSummary.reviewedCount} 张 / 留存 ${sessionSummary.retentionRate}%`}
            className="mb-4"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-base font-semibold">{sessionSummary.title}</div>
            <LearningStatusBadge tone={sessionSummary.tone}>
              留存 {sessionSummary.retentionRate}%
            </LearningStatusBadge>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {sessionSummary.description}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-5">
            <div className="rounded-md border bg-muted/20 px-3 py-2">
              <div className="text-xs text-muted-foreground">本轮复习</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {sessionSummary.reviewedCount}
              </div>
            </div>
            <div className="rounded-md border bg-rose-50 px-3 py-2 text-rose-700">
              <div className="text-xs">忘了</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {sessionSummary.ratingBreakdown.forgot}
              </div>
            </div>
            <div className="rounded-md border bg-amber-50 px-3 py-2 text-amber-900">
              <div className="text-xs">模糊</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {sessionSummary.ratingBreakdown.hard}
              </div>
            </div>
            <div className="rounded-md border bg-emerald-50 px-3 py-2 text-emerald-800">
              <div className="text-xs">记得</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {sessionSummary.ratingBreakdown.good}
              </div>
            </div>
            <div className="rounded-md border bg-indigo-50 px-3 py-2 text-indigo-800">
              <div className="text-xs">很熟</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {sessionSummary.ratingBreakdown.easy}
              </div>
            </div>
          </div>
          {sessionSummary.weakAreas.length ? (
            <div className="mt-4 rounded-lg border bg-amber-50/50 p-3">
              <div className="text-sm font-medium">主要薄弱</div>
              <div className="mt-3 grid gap-2">
                {sessionSummary.weakAreas.map((area) => (
                  <div key={area.label} className="rounded-md border bg-background px-3 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium">{area.label}</div>
                      <div className="text-xs text-muted-foreground">
                        忘了 {area.forgotCount} / 模糊 {area.hardCount}
                      </div>
                    </div>
                    {area.exampleCards.length ? (
                      <div className="mt-2 text-xs leading-5 text-muted-foreground">
                        相关卡片：{area.exampleCards.join(" / ")}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-4 rounded-lg border bg-muted/20 p-3">
            <div className="text-sm font-medium">建议</div>
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
            {sessionSummary.remediationLessonLabel ? (
              <div className="mt-3 rounded-md border border-dashed bg-background px-3 py-2 text-xs text-muted-foreground">
                建议明天补弱短课：{sessionSummary.remediationLessonLabel}
              </div>
            ) : null}
          </div>
          {sessionSummary.remediationActions.length ? (
            <div className="mt-4 rounded-lg border bg-rose-50/40 p-3">
              <div className="text-sm font-medium">补弱动作</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {sessionSummary.remediationActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="grid min-h-24 gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-medium">{action.label}</span>
                    <span className="text-xs leading-5 text-muted-foreground">
                      {action.description}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
            <Button asChild size="sm" variant="secondary" className="min-h-11 w-full sm:w-auto">
              <a href={sessionSummary.primaryAction.href}>{sessionSummary.primaryAction.label}</a>
            </Button>
            <Button asChild size="sm" variant="outline" className="min-h-11 w-full sm:w-auto">
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

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import {
  buildKnowledgeLink,
  knowledgeEntityVerificationBadge,
  normalizeSlug,
} from "@/server/knowledge/base";
import { DEFAULT_KNOWLEDGE_PATHS, buildKnowledgePathProgress } from "@/server/knowledge/paths";
import { buildRadarRelationGroups } from "@/server/knowledge/radar-relations";
import { generateRadarFlashcardAction } from "@/app/radar/actions";
import { KnowledgePathExplorer } from "@/components/learning/knowledge-path-explorer";
import {
  formatGlossaryCategoryLabel,
  formatKnowledgeEntityTypeLabel,
  formatRadarConfidenceLabel,
  formatRadarVerificationLabel,
} from "@/app/_lib/home-labels";

type SourceRef = { title?: string; url?: string };
type TimelineItem = { year?: string; event?: string };

const radarCardSelect = {
  id: true,
  dueAt: true,
  reviewCount: true,
} as const;

const radarCtaClassName = "min-h-11 w-full sm:w-auto";
const radarSearchInputClassName = "min-h-11";
const radarResultLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors";
const radarTypeFilterLinkClassName =
  "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50";
const radarRelationLinkClassName = "min-h-11 rounded-md border bg-card p-2 text-sm transition-colors hover:bg-muted/50";
const radarSourceLinkClassName = "inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline";

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function sourceRefs(value: unknown) {
  return Array.isArray(value)
    ? value.filter((x): x is SourceRef => typeof x === "object" && x !== null)
    : [];
}

function timeline(value: unknown) {
  return Array.isArray(value)
    ? value.filter((x): x is TimelineItem => typeof x === "object" && x !== null)
    : [];
}

function collectViewedRadarSlugs(plans: Array<{ lesson: { connections: unknown } | null }>) {
  const slugs = new Set<string>();
  for (const plan of plans) {
    const connections = plan.lesson?.connections;
    if (!connections || typeof connections !== "object") continue;
    const record = connections as {
      breadth?: { sourceKind?: unknown; sourceSlug?: unknown } | null;
      knowledgeFocus?: { radarSlugs?: unknown } | null;
    };
    if (record.breadth?.sourceKind === "radar") {
      const sourceSlug = record.breadth.sourceSlug;
      if (typeof sourceSlug === "string" && sourceSlug.trim()) {
        slugs.add(sourceSlug.trim().toLowerCase());
      }
    }
    const radarSlugs = record.knowledgeFocus?.radarSlugs;
    if (Array.isArray(radarSlugs)) {
      for (const slug of radarSlugs) {
        if (typeof slug === "string" && slug.trim()) slugs.add(slug.trim().toLowerCase());
      }
    }
  }
  return slugs;
}

function formatRadarRelationBadgeLabel(item: { key: string; badge: string }) {
  if (item.key.startsWith("term:")) return formatGlossaryCategoryLabel(item.badge);
  return formatKnowledgeEntityTypeLabel(item.badge);
}

export default async function RadarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; entity?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();
  await getOrCreateUserProfile({ userId });

  const q = (sp.q ?? "").trim();
  const selectedType = (sp.type ?? "").trim();
  const selectedSlug = (sp.entity ?? "").trim();

  const where = {
    ...(selectedType ? { type: selectedType } : {}),
    ...(q
      ? {
          OR: [
            { slug: { contains: q, mode: "insensitive" as const } },
            { name: { contains: q, mode: "insensitive" as const } },
            { oneLine: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [entities, typeGroups, generatedCards, viewedPlans] = await Promise.all([
    prisma.knowledgeEntity.findMany({
      where,
      orderBy: [{ type: "asc" }, { confidence: "desc" }, { slug: "asc" }],
      take: 200,
    }),
    prisma.knowledgeEntity.groupBy({
      by: ["type"],
      _count: { _all: true },
      orderBy: { type: "asc" },
    }),
    prisma.flashcard.findMany({
      where: { userId, lessonId: null, tags: { array_contains: ["radar"] } },
      select: radarCardSelect,
      take: 500,
    }),
    prisma.dailyPlan.findMany({
      where: { userId, isTest: false, archivedAt: null },
      select: { lesson: { select: { connections: true } } },
      orderBy: [{ localDate: "desc" }],
      take: 120,
    }),
  ]);

  const selectedEntity =
    entities.find((entity) => entity.slug === selectedSlug) ??
    (selectedSlug ? await prisma.knowledgeEntity.findUnique({ where: { slug: selectedSlug } }) : null) ??
    entities[0] ??
    null;
  const generatedCardIds = new Set(generatedCards.map((card) => card.id));
  const viewedSlugs = collectViewedRadarSlugs(viewedPlans);
  const reviewedCardIds = new Set(
    generatedCards.filter((card) => card.reviewCount > 0).map((card) => card.id),
  );
  const now = new Date();
  const weakCardIds = new Set(
    generatedCards
      .filter((card) => card.dueAt <= now && card.reviewCount === 0)
      .map((card) => card.id),
  );
  const selectedCardId = selectedEntity ? `radar:${userId}:${selectedEntity.slug}` : null;
  const selectedHasCard = selectedCardId ? generatedCardIds.has(selectedCardId) : false;
  const verificationBadge = selectedEntity
    ? knowledgeEntityVerificationBadge({
        sourceRefs: selectedEntity.sourceRefs,
        lastVerifiedAt: selectedEntity.lastVerifiedAt,
        confidence: selectedEntity.confidence,
      })
    : null;

  const selectedRelatedSlugs = selectedEntity ? strings(selectedEntity.relatedTerms) : [];
  const selectedWorks = selectedEntity ? strings(selectedEntity.representativeWorks) : [];
  const relatedLookupSlugs = [...new Set([...selectedRelatedSlugs, ...selectedWorks].map(normalizeSlug).filter(Boolean))];
  const [relatedGlossaryTerms, relatedEntities] = selectedEntity
    ? await Promise.all([
        relatedLookupSlugs.length
          ? prisma.glossaryTerm.findMany({
              where: { slug: { in: relatedLookupSlugs } },
              select: { slug: true, fullName: true, abbreviation: true, category: true, oneLine: true },
              take: 12,
            })
          : Promise.resolve([]),
        relatedLookupSlugs.length
          ? prisma.knowledgeEntity.findMany({
              where: {
                OR: [
                  { slug: { in: relatedLookupSlugs } },
                  { relatedTerms: { array_contains: [selectedEntity.name] } },
                  { relatedTerms: { array_contains: selectedRelatedSlugs } },
                  { representativeWorks: { array_contains: selectedWorks } },
                ],
                NOT: { slug: selectedEntity.slug },
              },
              select: {
                slug: true,
                type: true,
                name: true,
                oneLine: true,
                representativeWorks: true,
                relatedTerms: true,
              },
              take: 16,
            })
          : Promise.resolve([]),
      ])
    : [[], []];
  const relationGroups = selectedEntity
    ? buildRadarRelationGroups({
        selectedEntity: {
          slug: selectedEntity.slug,
          type: selectedEntity.type,
          name: selectedEntity.name,
          representativeWorks: selectedEntity.representativeWorks,
          relatedTerms: selectedEntity.relatedTerms,
        },
        glossaryTerms: relatedGlossaryTerms,
        entities: relatedEntities,
      })
    : [];

  const recommendedPaths = DEFAULT_KNOWLEDGE_PATHS
    .filter((p) => p.kind === "radar")
    .map((path) =>
      buildKnowledgePathProgress({
        path,
        viewedSlugs,
        generatedCardIds,
        reviewedCardIds,
        weakCardIds,
        cardIdForSlug: (slug) => `radar:${userId}:${slug}`,
      }),
    );

  return (
    <AppShell
      activePath="/radar"
      title="AI Radar"
      actions={
        <Button asChild size="sm" variant="secondary" className={radarCtaClassName}>
          <Link href="/review">去复习</Link>
        </Button>
      }
    >
      <PageHeader
        title="AI Radar"
        subtitle="人物、公司、论文、Benchmark、工具与开源项目的广度学习库"
        badge="探索"
      />

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">筛选实体</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <KnowledgePathExplorer
              paths={recommendedPaths}
              hrefForSlug={(slug) => `/radar?entity=${encodeURIComponent(slug)}`}
            />

            <form className="grid gap-2">
              <Input
                name="q"
                placeholder="搜索 OpenAI / SWE-bench / Cursor"
                defaultValue={q}
                className={radarSearchInputClassName}
              />
              {selectedType ? <input type="hidden" name="type" value={selectedType} /> : null}
              <Button type="submit" size="sm" className={radarCtaClassName}>搜索</Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link
                href={q ? `/radar?q=${encodeURIComponent(q)}` : "/radar"}
                className={[
                  radarTypeFilterLinkClassName,
                  selectedType ? "bg-background" : "border-secondary bg-secondary text-secondary-foreground",
                ].join(" ")}
              >
                全部
              </Link>
              {typeGroups.map((group) => {
                const params = new URLSearchParams({ type: group.type, ...(q ? { q } : {}) });
                return (
                  <Link
                    key={group.type}
                    href={`/radar?${params.toString()}`}
                    className={[
                      radarTypeFilterLinkClassName,
                      selectedType === group.type
                        ? "border-secondary bg-secondary text-secondary-foreground"
                        : "bg-background",
                    ].join(" ")}
                  >
                    {formatKnowledgeEntityTypeLabel(group.type)} {group._count._all}
                  </Link>
                );
              })}
            </div>

            <div className="grid gap-2">
              {entities.length ? (
                entities.map((entity) => {
                  const active = selectedEntity?.slug === entity.slug;
                  const params = new URLSearchParams({
                    entity: entity.slug,
                    ...(q ? { q } : {}),
                    ...(selectedType ? { type: selectedType } : {}),
                  });
                  return (
                    <Link
                      key={entity.id}
                      href={`/radar?${params.toString()}`}
                      className={[
                        radarResultLinkClassName,
                        active ? "bg-muted" : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{entity.name}</div>
                          <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {entity.oneLine}
                          </div>
                        </div>
                        <Badge variant="outline">{formatKnowledgeEntityTypeLabel(entity.type)}</Badge>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">暂无匹配实体。请先执行 seed。</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Radar 详情</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {selectedEntity ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-semibold">{selectedEntity.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {strings(selectedEntity.aliases).join(" / ") || selectedEntity.slug}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{formatKnowledgeEntityTypeLabel(selectedEntity.type)}</Badge>
                    <Badge variant="outline">{formatRadarConfidenceLabel(selectedEntity.confidence)}</Badge>
                    {verificationBadge ? (
                      <Badge variant={verificationBadge === "verified" ? "secondary" : "outline"}>
                        {formatRadarVerificationLabel(verificationBadge)}
                      </Badge>
                    ) : null}
                    {selectedEntity.lastVerifiedAt ? (
                      <Badge variant="outline">
                        核验日期 {selectedEntity.lastVerifiedAt.toISOString().slice(0, 10)}
                      </Badge>
                    ) : null}
                    {selectedHasCard ? <Badge variant="secondary">已生成卡片</Badge> : null}
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-sm font-medium">一句话</div>
                  <div className="mt-2 text-sm text-muted-foreground">{selectedEntity.oneLine}</div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">为什么重要</div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {selectedEntity.whyImportant ?? "-"}
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">自测问题</div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {selectedEntity.selfCheckQuestion ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">代表内容</div>
                    <ul className="mt-2 grid list-disc gap-1 pl-4 text-sm text-muted-foreground">
                      {strings(selectedEntity.representativeWorks).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">相关术语</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {strings(selectedEntity.relatedTerms).map((term) => (
                        <Badge key={term} variant="outline">{term}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">时间线</div>
                    <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                      {timeline(selectedEntity.timeline).map((item, index) => (
                        <div key={`${item.year}:${index}`}>
                          <span className="font-medium text-foreground">{item.year}</span> {item.event}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="grid gap-2 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-medium">关系卡片链</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        从实体跳到相关实体、术语、论文和 Benchmark，再回到课程与复习。
                      </div>
                    </div>
                    <Button asChild size="sm" variant="secondary" className={radarCtaClassName}>
                      <Link href="/review">去复习</Link>
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {relationGroups.map((group) => (
                      <div key={group.title} className="rounded-md border bg-muted/10 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-medium">{group.title}</div>
                            <div className="mt-1 text-xs leading-5 text-muted-foreground">
                              {group.description}
                            </div>
                          </div>
                          <Badge variant="outline">{group.items.length}</Badge>
                        </div>
                        <div className="mt-3 grid gap-2">
                          {group.items.length ? (
                            group.items.map((item) => (
                              <Link
                                key={item.key}
                                href={item.href}
                                className={radarRelationLinkClassName}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="truncate font-medium">{item.title}</div>
                                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                      {item.subtitle}
                                    </div>
                                  </div>
                                  <Badge variant="outline">{formatRadarRelationBadgeLabel(item)}</Badge>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                              暂无可用关系卡片。
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-sm font-medium">来源</div>
                  <div className="mt-2 grid gap-1 text-sm">
                    {sourceRefs(selectedEntity.sourceRefs).length ? sourceRefs(selectedEntity.sourceRefs).map((ref, index) =>
                      ref.url ? (
                        <a
                          key={`${ref.url}:${index}`}
                          href={ref.url}
                          className={radarSourceLinkClassName}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {ref.title ?? ref.url}
                        </a>
                      ) : null,
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        待核验：该实体暂无可核验来源。
                      </div>
                    )}
                  </div>
                </div>

                <form action={generateRadarFlashcardAction} className="grid gap-2 sm:flex sm:flex-wrap">
                  <input type="hidden" name="slug" value={selectedEntity.slug} />
                  <Button type="submit" disabled={selectedHasCard} className={radarCtaClassName}>
                    {selectedHasCard ? "复习卡片已存在" : "生成复习卡片"}
                  </Button>
                  <Button asChild variant="secondary" className={radarCtaClassName}>
                    <Link href={buildKnowledgeLink({ kind: "radar", slug: selectedEntity.slug })}>
                      复制详情入口
                    </Link>
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">暂无 Radar 详情。</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

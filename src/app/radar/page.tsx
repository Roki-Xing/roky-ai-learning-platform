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
} from "@/server/knowledge/base";
import { DEFAULT_KNOWLEDGE_PATHS } from "@/server/knowledge/paths";
import { generateRadarFlashcardAction } from "@/app/radar/actions";

type SourceRef = { title?: string; url?: string };
type TimelineItem = { year?: string; event?: string };

const radarCardSelect = {
  id: true,
  dueAt: true,
  reviewCount: true,
} as const;

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

  const [entities, typeGroups, generatedCards] = await Promise.all([
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
  ]);

  const selectedEntity =
    entities.find((entity) => entity.slug === selectedSlug) ??
    (selectedSlug ? await prisma.knowledgeEntity.findUnique({ where: { slug: selectedSlug } }) : null) ??
    entities[0] ??
    null;
  const generatedCardIds = new Set(generatedCards.map((card) => card.id));
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
  const relatedGlossaryTerms = selectedRelatedSlugs.length
    ? await prisma.glossaryTerm.findMany({
        where: { slug: { in: selectedRelatedSlugs.map((x) => x.trim().toLowerCase()) } },
        select: { slug: true, fullName: true, abbreviation: true, category: true },
        take: 8,
      })
    : [];

  const recommendedPaths = DEFAULT_KNOWLEDGE_PATHS.slice(0, 2);

  return (
    <AppShell
      activePath="/radar"
      title="AI Radar"
      actions={
        <Button asChild size="sm" variant="secondary">
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
            <div className="rounded-md border bg-muted/20 p-3">
              <div className="text-sm font-medium">探索路径</div>
              <div className="mt-1 text-xs text-muted-foreground">
                从一个实体出发，串起相关术语与下一步学习。
              </div>
              <div className="mt-2 grid gap-2">
                {recommendedPaths.map((p) => (
                  <div key={p.id} className="rounded-md border bg-background p-2">
                    <div className="text-sm font-medium">{p.label}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.slugs.slice(0, 5).map((slug) => (
                        <Badge key={slug} asChild variant="outline">
                          <Link href={`/glossary?term=${encodeURIComponent(slug)}`}>{slug}</Link>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form className="grid gap-2">
              <Input name="q" placeholder="搜索 OpenAI / SWE-bench / Cursor" defaultValue={q} />
              {selectedType ? <input type="hidden" name="type" value={selectedType} /> : null}
              <Button type="submit" size="sm">搜索</Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Badge asChild variant={selectedType ? "outline" : "secondary"}>
                <Link href={q ? `/radar?q=${encodeURIComponent(q)}` : "/radar"}>全部</Link>
              </Badge>
              {typeGroups.map((group) => {
                const params = new URLSearchParams({ type: group.type, ...(q ? { q } : {}) });
                return (
                  <Badge
                    key={group.type}
                    asChild
                    variant={selectedType === group.type ? "secondary" : "outline"}
                  >
                    <Link href={`/radar?${params.toString()}`}>
                      {group.type} {group._count._all}
                    </Link>
                  </Badge>
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
                        "rounded-md border px-3 py-2 text-sm transition-colors",
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
                        <Badge variant="outline">{entity.type}</Badge>
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
                    <Badge variant="secondary">{selectedEntity.type}</Badge>
                    <Badge variant="outline">confidence {selectedEntity.confidence}</Badge>
                    {verificationBadge ? (
                      <Badge variant={verificationBadge === "verified" ? "secondary" : "outline"}>
                        {verificationBadge}
                      </Badge>
                    ) : null}
                    {selectedEntity.lastVerifiedAt ? (
                      <Badge variant="outline">
                        verified {selectedEntity.lastVerifiedAt.toISOString().slice(0, 10)}
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
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">关系卡</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        从实体跳到相关术语，再回到课程与复习。
                      </div>
                    </div>
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/review">去复习</Link>
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedGlossaryTerms.length ? (
                      relatedGlossaryTerms.map((term) => (
                        <Badge key={term.slug} asChild variant="outline">
                          <Link href={`/glossary?term=${encodeURIComponent(term.slug)}`}>
                            {term.abbreviation ?? term.fullName}
                          </Link>
                        </Badge>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无可用关系术语。</div>
                    )}
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
                          className="text-primary underline-offset-4 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {ref.title ?? ref.url}
                        </a>
                      ) : null,
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        needs_verification：该实体暂无可核验来源。
                      </div>
                    )}
                  </div>
                </div>

                <form action={generateRadarFlashcardAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="slug" value={selectedEntity.slug} />
                  <Button type="submit" disabled={selectedHasCard}>
                    {selectedHasCard ? "复习卡片已存在" : "生成复习卡片"}
                  </Button>
                  <Button asChild variant="secondary">
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

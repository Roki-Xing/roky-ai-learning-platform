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
import { buildKnowledgeLink } from "@/server/knowledge/base";
import { DEFAULT_KNOWLEDGE_PATHS, buildKnowledgePathProgress } from "@/server/knowledge/paths";
import { generateGlossaryFlashcardAction } from "@/app/glossary/actions";

type SourceRef = { title?: string; url?: string };
type GlossaryCardStatus = {
  id: string;
  dueAt: Date;
  reviewCount: number;
};

const glossaryCardSelect = {
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

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; term?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();
  await getOrCreateUserProfile({ userId });

  const q = (sp.q ?? "").trim();
  const selectedCategory = (sp.category ?? "").trim();
  const selectedSlug = (sp.term ?? "").trim();

  const where = {
    ...(selectedCategory ? { category: selectedCategory } : {}),
    ...(q
      ? {
          OR: [
            { slug: { contains: q, mode: "insensitive" as const } },
            { abbreviation: { contains: q, mode: "insensitive" as const } },
            { fullName: { contains: q, mode: "insensitive" as const } },
            { chineseName: { contains: q, mode: "insensitive" as const } },
            { oneLine: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [terms, categories, generatedCards] = await Promise.all([
    prisma.glossaryTerm.findMany({
      where,
      orderBy: [{ category: "asc" }, { difficulty: "asc" }, { slug: "asc" }],
      take: 200,
    }),
    prisma.glossaryTerm.groupBy({
      by: ["category"],
      _count: { _all: true },
      orderBy: { category: "asc" },
    }),
    prisma.flashcard.findMany({
      where: { userId, lessonId: null, tags: { array_contains: ["glossary"] } },
      select: glossaryCardSelect,
      take: 500,
    }) as Promise<GlossaryCardStatus[]>,
  ]);

  const selectedTerm =
    terms.find((term) => term.slug === selectedSlug) ??
    (selectedSlug ? await prisma.glossaryTerm.findUnique({ where: { slug: selectedSlug } }) : null) ??
    terms[0] ??
    null;
  const generatedCardIds = new Set(generatedCards.map((card) => card.id));
  const selectedCardId = selectedTerm ? `glossary:${userId}:${selectedTerm.slug}` : null;
  const selectedHasCard = selectedCardId ? generatedCardIds.has(selectedCardId) : false;
  const reviewedCardIds = new Set(
    generatedCards.filter((card) => card.reviewCount > 0).map((card) => card.id),
  );

  const selectedRelated = selectedTerm ? strings(selectedTerm.relatedTerms) : [];
  const relatedChain = selectedRelated
    .map((term) => {
      const slug = term.trim().toLowerCase();
      const hit = terms.find((t) => t.slug === slug);
      return hit ?? null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 5);
  const recommendedPaths = DEFAULT_KNOWLEDGE_PATHS
    .filter((p) => p.kind === "glossary")
    .slice(0, 2)
    .map((path) =>
      buildKnowledgePathProgress({
        path,
        generatedCardIds,
        reviewedCardIds,
        cardIdForSlug: (slug) => `glossary:${userId}:${slug}`,
      }),
    );

  return (
    <AppShell
      activePath="/glossary"
      title="术语库"
      actions={
        <Button asChild size="sm" variant="secondary">
          <Link href="/review">去复习</Link>
        </Button>
      }
    >
      <PageHeader
        title="术语库"
        subtitle="沉淀每日术语、Agent/RAG/Benchmark 概念和可复习卡片"
        badge="术语"
      />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">检索与分类</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-md border bg-muted/20 p-3">
              <div className="text-sm font-medium">今日推荐链路</div>
              <div className="mt-1 text-xs text-muted-foreground">
                不是看词典，而是在建立概念地图。
              </div>
              <div className="mt-2 grid gap-2">
                {recommendedPaths.map((p) => (
                  <div key={p.id} className="rounded-md border bg-background p-2">
                    <div className="text-sm font-medium">{p.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      已制卡 {p.cardCount}/{p.items.length}，已复习 {p.reviewedCount}/{p.items.length}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.items.slice(0, 5).map((item) => (
                        <Badge key={item.slug} asChild variant={item.reviewed ? "secondary" : "outline"}>
                          <Link href={`/glossary?term=${encodeURIComponent(item.slug)}`}>
                            {item.slug}
                            {item.hasCard ? " · card" : ""}
                          </Link>
                        </Badge>
                      ))}
                    </div>
                    {p.nextSlug ? (
                      <div className="mt-2">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/glossary?term=${encodeURIComponent(p.nextSlug)}`}>
                            learn next: {p.nextSlug}
                          </Link>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <form className="grid gap-2">
              <Input name="q" placeholder="搜索 CoT / RAG / SWE-bench" defaultValue={q} />
              {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
              <Button type="submit" size="sm">搜索</Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Badge asChild variant={selectedCategory ? "outline" : "secondary"}>
                <Link href={q ? `/glossary?q=${encodeURIComponent(q)}` : "/glossary"}>全部</Link>
              </Badge>
              {categories.map((c) => {
                const params = new URLSearchParams({
                  category: c.category,
                  ...(q ? { q } : {}),
                });
                return (
                  <Badge
                    key={c.category}
                    asChild
                    variant={selectedCategory === c.category ? "secondary" : "outline"}
                  >
                    <Link href={`/glossary?${params.toString()}`}>
                      {c.category} {c._count._all}
                    </Link>
                  </Badge>
                );
              })}
            </div>

            <div className="grid gap-2">
              {terms.length ? (
                terms.map((term) => {
                  const active = selectedTerm?.slug === term.slug;
                  const params = new URLSearchParams({
                    term: term.slug,
                    ...(q ? { q } : {}),
                    ...(selectedCategory ? { category: selectedCategory } : {}),
                  });
                  return (
                    <Link
                      key={term.id}
                      href={`/glossary?${params.toString()}`}
                      className={[
                        "rounded-md border px-3 py-2 text-sm transition-colors",
                        active ? "bg-muted" : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {term.abbreviation ?? term.fullName}
                          </div>
                          <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {term.oneLine}
                          </div>
                        </div>
                        <Badge variant="outline">{term.category}</Badge>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">暂无匹配术语。请先执行 seed。</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">术语详情</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {selectedTerm ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-semibold">{selectedTerm.fullName}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {[selectedTerm.abbreviation, selectedTerm.chineseName].filter(Boolean).join(" / ")}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedTerm.category}</Badge>
                    <Badge variant="outline">{selectedTerm.difficulty}</Badge>
                    {selectedHasCard ? <Badge variant="secondary">已生成卡片</Badge> : null}
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-sm font-medium">一句话</div>
                  <div className="mt-2 text-sm text-muted-foreground">{selectedTerm.oneLine}</div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">相关术语链</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        用“路径”方式复习：从一个术语串到另一个术语。
                      </div>
                    </div>
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/review">去复习</Link>
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedChain.length ? (
                      relatedChain.map((t) => (
                        <Badge key={t.slug} asChild variant="outline">
                          <Link href={`/glossary?term=${encodeURIComponent(t.slug)}`}>
                            {t.abbreviation ?? t.fullName}
                          </Link>
                        </Badge>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无可用相关链路。</div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">解释</div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {selectedTerm.explanation}
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">为什么重要</div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {selectedTerm.whyImportant ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">相关术语</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {strings(selectedTerm.relatedTerms).map((term) => (
                        <Badge key={term} variant="outline">{term}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">常见误区</div>
                    <ul className="mt-2 grid list-disc gap-1 pl-4 text-sm text-muted-foreground">
                      {strings(selectedTerm.commonMistakes).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">例子</div>
                    <ul className="mt-2 grid list-disc gap-1 pl-4 text-sm text-muted-foreground">
                      {strings(selectedTerm.examples).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="text-sm font-medium">来源</div>
                  <div className="mt-2 grid gap-1 text-sm">
                    {sourceRefs(selectedTerm.sourceRefs).map((ref, index) =>
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
                    )}
                  </div>
                </div>

                <form action={generateGlossaryFlashcardAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="slug" value={selectedTerm.slug} />
                  <Button type="submit" disabled={selectedHasCard}>
                    {selectedHasCard ? "复习卡片已存在" : "生成复习卡片"}
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href={buildKnowledgeLink({ kind: "glossary", slug: selectedTerm.slug })}>
                      复制详情入口
                    </Link>
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">暂无术语详情。</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

import { buildKnowledgeLink, normalizeSlug } from "@/server/knowledge/base";

export type RadarRelationGroupTitle =
  | "相关实体"
  | "相关术语"
  | "相关论文"
  | "相关 Benchmark";

export type RadarRelationItem = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  badge: string;
};

export type RadarRelationGroup = {
  title: RadarRelationGroupTitle;
  description: string;
  items: RadarRelationItem[];
};

type RadarRelationSelectedEntity = {
  slug: string;
  type: string;
  name: string;
  representativeWorks: unknown;
  relatedTerms: unknown;
};

type RadarRelationGlossaryTerm = {
  slug: string;
  fullName: string;
  abbreviation?: string | null;
  category: string;
  oneLine?: string | null;
};

type RadarRelationEntity = {
  slug: string;
  type: string;
  name: string;
  oneLine: string;
  representativeWorks?: unknown;
  relatedTerms?: unknown;
};

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function includesNormalized(values: string[], target: string) {
  const normalizedTarget = normalizeSlug(target);
  return values.some((value) => normalizeSlug(value) === normalizedTarget);
}

function relationEntityMatches(args: {
  entity: RadarRelationEntity;
  selected: RadarRelationSelectedEntity;
  selectedTerms: string[];
  selectedWorks: string[];
}) {
  if (args.entity.slug === args.selected.slug) return false;
  const entityTerms = strings(args.entity.relatedTerms);
  const entityWorks = strings(args.entity.representativeWorks);
  if (includesNormalized(args.selectedTerms, args.entity.slug)) return true;
  if (includesNormalized(args.selectedTerms, args.entity.name)) return true;
  if (includesNormalized(args.selectedWorks, args.entity.slug)) return true;
  if (includesNormalized(args.selectedWorks, args.entity.name)) return true;
  if (includesNormalized(entityTerms, args.selected.slug)) return true;
  if (includesNormalized(entityTerms, args.selected.name)) return true;
  if (entityTerms.some((term) => includesNormalized(args.selectedTerms, term))) return true;
  if (entityWorks.some((work) => includesNormalized(args.selectedWorks, work))) return true;
  return false;
}

function entityItem(entity: RadarRelationEntity): RadarRelationItem {
  return {
    key: `entity:${entity.slug}`,
    title: entity.name,
    subtitle: entity.oneLine,
    href: buildKnowledgeLink({ kind: "radar", slug: entity.slug }),
    badge: entity.type,
  };
}

function termItem(term: RadarRelationGlossaryTerm): RadarRelationItem {
  return {
    key: `term:${term.slug}`,
    title: term.abbreviation ?? term.fullName,
    subtitle: term.oneLine ?? term.fullName,
    href: buildKnowledgeLink({ kind: "glossary", slug: term.slug }),
    badge: term.category,
  };
}

/**
 * Builds Radar relation groups for the selected entity.
 *
 * Args:
 *   args: Selected entity plus already-fetched glossary and entity candidates.
 *
 * Returns:
 *   Four stable card-chain groups for Radar relation navigation.
 */
export function buildRadarRelationGroups(args: {
  selectedEntity: RadarRelationSelectedEntity;
  glossaryTerms: RadarRelationGlossaryTerm[];
  entities: RadarRelationEntity[];
}): RadarRelationGroup[] {
  const selectedTerms = strings(args.selectedEntity.relatedTerms);
  const selectedWorks = strings(args.selectedEntity.representativeWorks);
  const relatedEntities = args.entities.filter((entity) =>
    relationEntityMatches({
      entity,
      selected: args.selectedEntity,
      selectedTerms,
      selectedWorks,
    }),
  );

  return [
    {
      title: "相关实体",
      description: "从当前实体跳到相邻人物、组织、工具或项目。",
      items: relatedEntities
        .filter((entity) => entity.type !== "paper" && entity.type !== "benchmark")
        .map(entityItem),
    },
    {
      title: "相关术语",
      description: "补上理解当前实体需要的核心概念。",
      items: args.glossaryTerms.map(termItem),
    },
    {
      title: "相关论文",
      description: "把代表工作追到论文或论文型实体。",
      items: relatedEntities.filter((entity) => entity.type === "paper").map(entityItem),
    },
    {
      title: "相关 Benchmark",
      description: "用评测基准校准当前实体的能力边界。",
      items: relatedEntities.filter((entity) => entity.type === "benchmark").map(entityItem),
    },
  ];
}

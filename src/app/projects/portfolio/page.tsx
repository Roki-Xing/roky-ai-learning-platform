import { AppShell } from "@/components/app-shell";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";
import { buildProjectPortfolioItems } from "@/server/projects/base";
import { getCurrentMissionData } from "@/server/learning/current-mission";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { ProjectPortfolioPageContent } from "@/app/projects/ui/project-mission-workspace";

export default async function ProjectPortfolioPage() {
  const userId = await requireUserId();
  const currentMission = await getCurrentMissionData(userId);
  const projects = await prisma.learningProject.findMany({
    where: { userId, status: "completed" },
    include: { milestones: { orderBy: [{ position: "asc" }] } },
    orderBy: [{ updatedAt: "desc" }],
    take: 100,
  });
  const projectCardCounts = await prisma.flashcard
    .findMany({
      where: { userId, type: "project", id: { startsWith: "project:" } },
      select: { id: true },
    })
    .then((cards) => {
      const counts: Record<string, number> = {};
      for (const card of cards) {
        const [, projectId] = card.id.split(":");
        if (!projectId) continue;
        counts[projectId] = (counts[projectId] ?? 0) + 1;
      }
      return counts;
    });

  return (
    <AppShell
      activePath="/projects"
      title="项目作品集"
      missionBanner={
        <CurrentMissionCard
          mission={currentMission.mission}
          signals={currentMission.signals}
        />
      }
    >
      <ProjectPortfolioPageContent items={buildProjectPortfolioItems(projects, projectCardCounts)} />
    </AppShell>
  );
}

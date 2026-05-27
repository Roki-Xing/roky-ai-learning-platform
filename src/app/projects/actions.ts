"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import {
  getProjectTemplate,
} from "@/server/projects/base";
import { reviewProjectMilestoneCode } from "@/server/projects/code-submission";
import { validateMilestoneLinks } from "@/server/projects/milestone-links";
import { completeLearningProject } from "@/server/projects/submit";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

async function activateOrCompleteProject(projectId: string, userId: string) {
  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId },
    include: { milestones: { orderBy: [{ position: "asc" }] } },
  });
  if (!project) throw new Error("Project not found");

  const allCompleted =
    project.milestones.length > 0 &&
    project.milestones.every((milestone) => milestone.status === "completed");

  if (!allCompleted) {
    if (project.status === "planned") {
      await prisma.learningProject.update({
        where: { id: project.id },
        data: { status: "active", startedAt: project.startedAt ?? new Date() },
      });
    }
    return project;
  }

  await completeLearningProject({ userId, projectId: project.id });
  return project;
}

export async function startProjectAction(formData: FormData) {
  const userId = await requireUserId();
  const templateSlug = text(formData, "templateSlug");
  const template = getProjectTemplate(templateSlug);
  if (!template) throw new Error("Project template not found");

  await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const existing = await prisma.learningProject.findUnique({
    where: { userId_templateSlug: { userId, templateSlug } },
    select: { id: true },
  });
  if (existing) redirect(`/projects?projectId=${encodeURIComponent(existing.id)}`);

  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.learningProject.create({
      data: {
        userId,
        templateSlug,
        type: template.type,
        title: template.title,
        description: template.description,
        difficulty: template.difficulty,
        status: "active",
        startedAt: new Date(),
        relatedTopics: template.relatedTopics as Prisma.InputJsonValue,
      },
    });

    for (let index = 0; index < template.milestones.length; index++) {
      const milestone = template.milestones[index]!;
      await tx.projectMilestone.create({
        data: {
          projectId: created.id,
          userId,
          position: index + 1,
          title: milestone.title,
          task: milestone.task,
          codePrompt: milestone.codePrompt,
          reflectionPrompt: milestone.reflectionPrompt,
          status: index === 0 ? "active" : "planned",
          relatedTopics: milestone.relatedTopics as Prisma.InputJsonValue,
        },
      });
    }

    return created;
  });

  revalidatePath("/projects");
  revalidatePath("/progress");
  redirect(`/projects?projectId=${encodeURIComponent(project.id)}`);
}

export async function completeMilestoneAction(formData: FormData) {
  const userId = await requireUserId();
  const projectId = text(formData, "projectId");
  const milestoneId = text(formData, "milestoneId");
  const lessonIdRaw = text(formData, "lessonId") || null;
  const noteIdRaw = text(formData, "noteId") || null;
  const code = String(formData.get("code") ?? "");
  const note = String(formData.get("note") ?? "");
  const reflection = String(formData.get("reflection") ?? "");

  if (!projectId) throw new Error("Missing projectId");
  if (!milestoneId) throw new Error("Missing milestoneId");

  const milestone = await prisma.projectMilestone.findFirst({
    where: { id: milestoneId, projectId, userId },
    select: { position: true },
  });
  if (!milestone) throw new Error("Milestone not found");

  const { lessonId, noteId } = await validateMilestoneLinks({
    userId,
    lessonId: lessonIdRaw,
    noteId: noteIdRaw,
  });

  await prisma.$transaction(async (tx) => {
    await tx.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        status: "completed",
        lessonId,
        noteId,
        code: code.trim() ? code : null,
        note: note.trim() ? note : null,
        reflection: reflection.trim() ? reflection : null,
        completedAt: new Date(),
      },
    });

    await tx.projectMilestone.updateMany({
      where: {
        projectId,
        userId,
        position: milestone.position + 1,
        status: "planned",
      },
      data: { status: "active" },
    });

    await tx.learningProject.update({
      where: { id: projectId },
      data: { status: "active", startedAt: new Date() },
    });
  });

  await activateOrCompleteProject(projectId, userId);

  revalidatePath("/projects");
  revalidatePath("/review");
  revalidatePath("/progress");
  redirect(`/projects?projectId=${encodeURIComponent(projectId)}`);
}

export async function saveMilestoneDraftAction(formData: FormData) {
  const userId = await requireUserId();
  const projectId = text(formData, "projectId");
  const milestoneId = text(formData, "milestoneId");
  const lessonIdRaw = text(formData, "lessonId") || null;
  const noteIdRaw = text(formData, "noteId") || null;

  if (!projectId) throw new Error("Missing projectId");
  if (!milestoneId) throw new Error("Missing milestoneId");

  const milestone = await prisma.projectMilestone.findFirst({
    where: { id: milestoneId, projectId, userId },
    select: { id: true },
  });
  if (!milestone) throw new Error("Milestone not found");

  const { lessonId, noteId } = await validateMilestoneLinks({
    userId,
    lessonId: lessonIdRaw,
    noteId: noteIdRaw,
  });

  await prisma.projectMilestone.update({
    where: { id: milestoneId },
    data: {
      lessonId,
      noteId,
      code: String(formData.get("code") ?? "") || null,
      note: String(formData.get("note") ?? "") || null,
      reflection: String(formData.get("reflection") ?? "") || null,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/progress");
  redirect(`/projects?projectId=${encodeURIComponent(projectId)}`);
}

export async function reviewMilestoneCodeAction(formData: FormData) {
  const userId = await requireUserId();
  const projectId = text(formData, "projectId");
  const milestoneId = text(formData, "milestoneId");
  const lessonIdRaw = text(formData, "lessonId") || null;
  const noteIdRaw = text(formData, "noteId") || null;
  const language = text(formData, "language") || "python";
  const localDate = text(formData, "localDate") || undefined;
  const code = String(formData.get("code") ?? "");
  const note = String(formData.get("note") ?? "");
  const reflection = String(formData.get("reflection") ?? "");

  if (!projectId) throw new Error("Missing projectId");
  if (!milestoneId) throw new Error("Missing milestoneId");

  const milestone = await prisma.projectMilestone.findFirst({
    where: { id: milestoneId, projectId, userId },
    select: { id: true },
  });
  if (!milestone) throw new Error("Milestone not found");

  const { lessonId, noteId } = await validateMilestoneLinks({
    userId,
    lessonId: lessonIdRaw,
    noteId: noteIdRaw,
  });

  await prisma.projectMilestone.update({
    where: { id: milestoneId },
    data: {
      lessonId,
      noteId,
      code: code.trim() ? code : null,
      note: note.trim() ? note : null,
      reflection: reflection.trim() ? reflection : null,
    },
  });

  await reviewProjectMilestoneCode({
    userId,
    projectId,
    milestoneId,
    localDate,
    language,
  });

  revalidatePath("/projects");
  revalidatePath("/review");
  revalidatePath("/progress");
  redirect(`/projects?projectId=${encodeURIComponent(projectId)}`);
}

export async function completeProjectAction(formData: FormData) {
  const userId = await requireUserId();
  const projectId = text(formData, "projectId");
  if (!projectId) throw new Error("Missing projectId");

  const project = await completeLearningProject({ userId, projectId });

  revalidatePath("/projects");
  revalidatePath("/review");
  revalidatePath("/progress");
  redirect(`/projects?projectId=${encodeURIComponent(project.projectId)}`);
}

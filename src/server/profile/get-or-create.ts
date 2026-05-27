import { prisma } from "@/server/db";

export async function getOrCreateUserProfile(args: { userId: string }) {
  const { userId } = args;

  return await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

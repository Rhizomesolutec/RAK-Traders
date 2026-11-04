import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export type CurrentAdmin = { id: string; name: string; email: string };

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session = await getSession();
  if (!session) return null;
  return prisma.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, name: true, email: true },
  });
}

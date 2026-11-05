import { getSession } from "@/lib/session";
import { findAdminById } from "@/lib/store";

export type CurrentAdmin = { id: string; name: string; email: string };

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session = await getSession();
  if (!session) return null;
  const admin = await findAdminById(session.adminId);
  if (!admin) return null;
  return { id: admin.id, name: admin.name, email: admin.email };
}

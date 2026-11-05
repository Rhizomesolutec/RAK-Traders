import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getCurrentAdmin } from "@/lib/auth";

async function AdminShell({ children }: { children: React.ReactNode }) {
  await connection();
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <div className="md:flex">
      <AdminSidebar name={admin.name} />
      <div className="min-w-0 flex-1 p-5 md:p-8">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-lg">Loading admin…</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

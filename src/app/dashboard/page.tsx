import { getCachedOrganizations, getCachedSession } from "@/lib/auth-cache";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  console.debug("[START: dashboard]");

  const session = await getCachedSession();

  if (!session) {
    console.debug("[END: dashboard] unauthenticated");
    redirect("/login");
  }

  const orgs = await getCachedOrganizations();

  if (!orgs || orgs.length === 0) {
    console.debug("[END: dashboard] no org");
    redirect("/create-workspace");
  }

  const active = session.session.activeOrganizationId
    ? orgs.find((o) => o.id === session.session.activeOrganizationId)
    : orgs[0];

  console.debug("[END: dashboard]", { slug: active?.slug });
  redirect(`/dashboard/${active?.slug}`);
}

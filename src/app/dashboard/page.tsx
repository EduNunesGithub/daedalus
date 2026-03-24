import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  console.debug("[START: dashboard]");

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    console.debug("[END: dashboard] unauthenticated — redirecting");
    redirect("/login");
  }

  const orgs = await auth.api.listOrganizations({ headers: await headers() });

  if (!orgs || orgs.length === 0) {
    console.debug("[END: dashboard] no org — redirecting to create-workspace");
    redirect("/create-workspace");
  }

  const active = session.session.activeOrganizationId
    ? orgs.find((o) => o.id === session.session.activeOrganizationId)
    : orgs[0];

  console.debug("[END: dashboard]", { slug: active?.slug });
  redirect(`/dashboard/${active?.slug}`);
}

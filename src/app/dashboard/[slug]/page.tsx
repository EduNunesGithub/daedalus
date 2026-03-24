import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorkspaceDashboardPage({ params }: Props) {
  const { slug } = await params;

  console.debug("[START: workspace-dashboard]", { slug });

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    console.debug("[END: workspace-dashboard] unauthenticated");
    redirect("/login");
  }

  const org = await auth.api.getFullOrganization({
    headers: await headers(),
    query: { organizationSlug: slug },
  });

  if (!org) {
    console.debug("[END: workspace-dashboard] org not found");
    redirect("/dashboard");
  }

  console.debug("[END: workspace-dashboard]", { orgId: org.id, slug });

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{org.name}</h1>
        <p className="text-sm text-muted-foreground">
          {org.members.length} {org.members.length === 1 ? "member" : "members"}
        </p>
      </div>
    </div>
  );
}

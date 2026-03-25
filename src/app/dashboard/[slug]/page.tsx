import { getCachedOrganization } from "@/lib/auth-cache";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorkspaceDashboardPage({ params }: Props) {
  const { slug } = await params;

  console.debug("[START: workspace-dashboard]", { slug });

  const org = await getCachedOrganization(slug);

  console.debug("[END: workspace-dashboard]", { orgId: org?.id, slug });

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold">{org?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {org?.members.length}{" "}
            {org?.members.length === 1 ? "member" : "members"}
          </p>
        </div>
      </div>
    </div>
  );
}

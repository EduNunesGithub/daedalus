import SiteSettingsForm from "@/components/sites/site-settings-form";
import { getCachedOrganization } from "@/lib/auth-cache";
import { db } from "@/db/index";
import { site as siteTable } from "@/db/schemas/schema";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ siteId: string; slug: string }>;
}

export default async function SiteSettingsPage({ params }: Props) {
  const { siteId, slug } = await params;

  console.debug("[START: site-settings-page]", { siteId, slug });

  const org = await getCachedOrganization(slug);

  if (!org) {
    console.debug("[END: site-settings-page] org not found");
    redirect("/dashboard");
  }

  const [foundSite] = await db
    .select()
    .from(siteTable)
    .where(and(eq(siteTable.id, siteId), eq(siteTable.workspaceId, org.id)))
    .limit(1);

  if (!foundSite) {
    console.debug("[END: site-settings-page] site not found");
    redirect(`/dashboard/${slug}/sites`);
  }

  console.debug("[END: site-settings-page]", { siteId });

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">{foundSite.name}</p>
        </div>
      </div>
      <div className="max-w-md">
        <SiteSettingsForm site={foundSite} />
      </div>
    </div>
  );
}

import CreateSiteDialog from "@/components/sites/create-site-dialog";
import SitesTable from "@/components/sites/sites-table";
import { getCachedOrganization, getCachedSession } from "@/lib/auth-cache";
import { db } from "@/db/index";
import { site } from "@/db/schemas/schema";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SitesPage({ params }: Props) {
  const { slug } = await params;

  console.debug("[START: sites-page]", { slug });

  const [org, session] = await Promise.all([
    getCachedOrganization(slug),
    getCachedSession(),
  ]);

  if (!org || !session) {
    console.debug("[END: sites-page] unauthorized");
    redirect("/dashboard");
  }

  const sites = await db
    .select()
    .from(site)
    .where(eq(site.workspaceId, org.id))
    .orderBy(desc(site.createdAt));

  console.debug("[END: sites-page]", { count: sites.length, orgId: org.id });

  const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-semibold">Sites</h1>
            <p className="text-sm text-muted-foreground">
              {sites.length} {sites.length === 1 ? "site" : "sites"}
            </p>
          </div>
        </div>
        <CreateSiteDialog workspaceId={org.id} />
      </div>
      <SitesTable appUrl={appUrl} sites={sites} workspaceSlug={slug} />
    </div>
  );
}

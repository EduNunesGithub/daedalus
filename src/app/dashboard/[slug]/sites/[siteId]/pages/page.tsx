import CreatePageDialog from "@/components/pages/create-page-dialog";
import PagesTable from "@/components/pages/pages-table";
import { getCachedOrganization } from "@/lib/auth-cache";
import { db } from "@/db/index";
import { page as pageTable, site as siteTable } from "@/db/schemas/schema";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ siteId: string; slug: string }>;
}

export default async function PagesPage({ params }: Props) {
  const { siteId, slug } = await params;

  console.debug("[START: pages-page]", { siteId, slug });

  const org = await getCachedOrganization(slug);

  if (!org) {
    console.debug("[END: pages-page] org not found");
    redirect("/dashboard");
  }

  const [foundSite] = await db
    .select()
    .from(siteTable)
    .where(and(eq(siteTable.id, siteId), eq(siteTable.workspaceId, org.id)))
    .limit(1);

  if (!foundSite) {
    console.debug("[END: pages-page] site not found");
    redirect(`/dashboard/${slug}/sites`);
  }

  const pages = await db
    .select()
    .from(pageTable)
    .where(eq(pageTable.siteId, siteId))
    .orderBy(desc(pageTable.updatedAt));

  console.debug("[END: pages-page]", { count: pages.length, siteId });

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-semibold">{foundSite.name}</h1>
            <p className="text-sm text-muted-foreground">
              {pages.length} {pages.length === 1 ? "page" : "pages"}
            </p>
          </div>
        </div>
        <CreatePageDialog siteId={siteId} workspaceId={org.id} />
      </div>
      <PagesTable
        orgSlug={slug}
        pages={pages}
        siteId={siteId}
        siteSlug={foundSite.slug}
      />
    </div>
  );
}

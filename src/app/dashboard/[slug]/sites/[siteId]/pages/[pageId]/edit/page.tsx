import { EditorCanvas } from "@/components/editor/index";
import { db } from "@/db/index";
import { page as pageTable, site as siteTable } from "@/db/schemas/schema";
import { getCachedOrganization } from "@/lib/auth-cache";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ pageId: string; siteId: string; slug: string }>;
}

export default async function EditPage({ params }: Props) {
  const { pageId, siteId, slug } = await params;

  console.debug("[START: edit-page]", { pageId, siteId, slug });

  const org = await getCachedOrganization(slug);

  if (!org) {
    console.debug("[END: edit-page] org not found");
    redirect("/dashboard");
  }

  const [foundSite] = await db
    .select()
    .from(siteTable)
    .where(and(eq(siteTable.id, siteId), eq(siteTable.workspaceId, org.id)))
    .limit(1);

  if (!foundSite) {
    console.debug("[END: edit-page] site not found");
    redirect(`/dashboard/${slug}/sites`);
  }

  const [foundPage] = await db
    .select()
    .from(pageTable)
    .where(and(eq(pageTable.id, pageId), eq(pageTable.workspaceId, org.id)))
    .limit(1);

  if (!foundPage) {
    console.debug("[END: edit-page] page not found");
    redirect(`/dashboard/${slug}/sites/${siteId}/pages`);
  }

  const initialContent = foundPage.content
    ? JSON.stringify(foundPage.content)
    : null;

  console.debug("[END: edit-page]", { pageId });

  return (
    <EditorCanvas
      initialContent={initialContent}
      orgSlug={slug}
      pageId={pageId}
      pageTitle={foundPage.title}
      siteId={siteId}
      status={foundPage.status}
    />
  );
}

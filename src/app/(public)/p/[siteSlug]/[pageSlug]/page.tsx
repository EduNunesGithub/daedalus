import { db } from "@/db/index";
import { page as pageTable, site as siteTable } from "@/db/schemas/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ pageSlug: string; siteSlug: string }>;
}

export default async function PublicPage({ params }: Props) {
  const { pageSlug, siteSlug } = await params;

  console.debug("[START: public-page]", { pageSlug, siteSlug });

  const [foundSite] = await db
    .select()
    .from(siteTable)
    .where(eq(siteTable.slug, siteSlug))
    .limit(1);

  if (!foundSite) {
    console.debug("[END: public-page] site not found");
    notFound();
  }

  const [foundPage] = await db
    .select()
    .from(pageTable)
    .where(
      and(
        eq(pageTable.siteId, foundSite.id),
        eq(pageTable.slug, pageSlug),
        eq(pageTable.status, "published"),
      ),
    )
    .limit(1);

  if (!foundPage) {
    console.debug("[END: public-page] page not found or not published");
    notFound();
  }

  console.debug("[END: public-page]", { pageId: foundPage.id });

  return (
    <main>
      <h1>{foundPage.title}</h1>
    </main>
  );
}

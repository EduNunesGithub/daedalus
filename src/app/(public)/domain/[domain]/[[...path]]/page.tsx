import { db } from "@/db/index";
import { page as pageTable, site as siteTable } from "@/db/schemas/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ domain: string; path?: string[] }>;
}

export default async function CustomDomainPage({ params }: Props) {
  const { domain, path } = await params;
  const pageSlug = path?.[0] ?? "home";

  console.debug("[START: custom-domain-page]", { domain, pageSlug });

  const [foundSite] = await db
    .select()
    .from(siteTable)
    .where(eq(siteTable.domain, domain))
    .limit(1);

  if (!foundSite) {
    console.debug("[END: custom-domain-page] site not found for domain");
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
    console.debug("[END: custom-domain-page] page not found or not published");
    notFound();
  }

  console.debug("[END: custom-domain-page]", { pageId: foundPage.id });

  return (
    <main>
      <h1>{foundPage.title}</h1>
    </main>
  );
}

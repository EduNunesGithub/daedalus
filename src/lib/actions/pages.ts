"use server";

import { db } from "@/db/index";
import { page } from "@/db/schemas/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function createPage(input: {
  siteId: string;
  slug: string;
  title: string;
  workspaceId: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  console.debug("[START: create-page]", { slug: input.slug });

  const id = crypto.randomUUID();

  await db.insert(page).values({
    id,
    siteId: input.siteId,
    slug: input.slug,
    title: input.title,
    workspaceId: input.workspaceId,
  });

  console.debug("[END: create-page]", { id });

  return { id };
}

export async function updatePageStatus(input: {
  id: string;
  status: "draft" | "published";
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  console.debug("[START: update-page-status]", input);

  await db
    .update(page)
    .set({ status: input.status })
    .where(eq(page.id, input.id));

  console.debug("[END: update-page-status]", input);
}

export async function deletePage(input: { id: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  console.debug("[START: delete-page]", { id: input.id });
  await db.delete(page).where(eq(page.id, input.id));
  console.debug("[END: delete-page]", { id: input.id });
}

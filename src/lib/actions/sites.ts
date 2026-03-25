"use server";

import { db } from "@/db/index";
import { site } from "@/db/schemas/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function createSite(input: {
  name: string;
  slug: string;
  workspaceId: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  console.debug("[START: create-site]", { slug: input.slug });

  const id = crypto.randomUUID();

  await db.insert(site).values({
    id,
    name: input.name,
    slug: input.slug,
    workspaceId: input.workspaceId,
  });

  console.debug("[END: create-site]", { id, slug: input.slug });

  return { id, slug: input.slug };
}

export async function updateSite(input: {
  domain?: string | null;
  id: string;
  name: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  console.debug("[START: update-site]", { id: input.id });

  await db
    .update(site)
    .set({ domain: input.domain ?? null, name: input.name })
    .where(eq(site.id, input.id));

  console.debug("[END: update-site]", { id: input.id });
}

export async function deleteSite(input: { id: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  console.debug("[START: delete-site]", { id: input.id });
  await db.delete(site).where(eq(site.id, input.id));
  console.debug("[END: delete-site]", { id: input.id });
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getCachedOrganization = cache(async (slug: string) => {
  return auth.api.getFullOrganization({
    headers: await headers(),
    query: { organizationSlug: slug },
  });
});

export const getCachedOrganizations = cache(async () => {
  return auth.api.listOrganizations({ headers: await headers() });
});

export const getCachedSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

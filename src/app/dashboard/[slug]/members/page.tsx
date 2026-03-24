import InviteDialog from "@/components/members/invite-dialog";
import MembersTable from "@/components/members/members-table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MembersPage({ params }: Props) {
  const { slug } = await params;

  console.debug("[START: members-page]", { slug });

  const hdrs = await headers();
  const [org, session] = await Promise.all([
    auth.api.getFullOrganization({
      headers: hdrs,
      query: { organizationSlug: slug },
    }),
    auth.api.getSession({ headers: hdrs }),
  ]);

  if (!org) {
    console.debug("[END: members-page] org not found");
    redirect("/dashboard");
  }

  console.debug("[END: members-page]", {
    memberCount: org.members.length,
    orgId: org.id,
  });

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-semibold">Members</h1>
            <p className="text-sm text-muted-foreground">
              {org.members.length}{" "}
              {org.members.length === 1 ? "member" : "members"}
            </p>
          </div>
        </div>
        <InviteDialog organizationId={org.id} />
      </div>
      <MembersTable
        currentUserId={session?.user.id ?? ""}
        members={org.members}
        organizationId={org.id}
      />
    </div>
  );
}

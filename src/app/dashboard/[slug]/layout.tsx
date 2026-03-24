import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardLayout({ children, params }: Props) {
  const { slug } = await params;

  console.debug("[START: dashboard-layout]", { slug });

  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session) {
    console.debug("[END: dashboard-layout] unauthenticated");
    redirect("/login");
  }

  const [org, orgs] = await Promise.all([
    auth.api.getFullOrganization({
      headers: hdrs,
      query: { organizationSlug: slug },
    }),
    auth.api.listOrganizations({ headers: hdrs }),
  ]);

  if (!org) {
    console.debug("[END: dashboard-layout] org not found");
    redirect("/dashboard");
  }

  console.debug("[END: dashboard-layout]", { orgId: org.id });

  return (
    <SidebarProvider>
      <AppSidebar currentSlug={slug} orgs={orgs ?? []} user={session.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

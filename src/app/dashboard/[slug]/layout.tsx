import AppSidebar from "@/components/app-sidebar";
import {
  getCachedOrganization,
  getCachedOrganizations,
  getCachedSession,
} from "@/lib/auth-cache";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardLayout({ children, params }: Props) {
  const { slug } = await params;

  console.debug("[START: dashboard-layout]", { slug });

  const session = await getCachedSession();

  if (!session) {
    console.debug("[END: dashboard-layout] unauthenticated");
    redirect("/login");
  }

  const [org, orgs] = await Promise.all([
    getCachedOrganization(slug),
    getCachedOrganizations(),
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

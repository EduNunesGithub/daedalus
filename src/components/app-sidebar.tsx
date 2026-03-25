"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { initials } from "@/lib/utils";
import {
  BuildingIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Org {
  id: string;
  name: string;
  slug: string;
}

interface User {
  email: string;
  id: string;
  image?: string | null;
  name: string;
}

interface AppSidebarProps {
  currentSlug: string;
  orgs: Org[];
  user: User;
}

const NAV_ITEMS = [
  { href: "", icon: LayoutDashboardIcon, label: "Overview" },
  { href: "/members", icon: UsersIcon, label: "Members" },
];

export default function AppSidebar({
  currentSlug,
  orgs,
  user,
}: AppSidebarProps) {
  const router = useRouter();
  const base = `/dashboard/${currentSlug}`;
  const currentOrg = orgs.find((o) => o.slug === currentSlug);

  const userInitials = initials(user.name);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BuildingIcon className="size-4" />
              </div>
              <span className="font-semibold">
                {currentOrg?.name ?? currentSlug}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    render={<Link href={`${base}${item.href}`} />}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {orgs.length > 1 && (
          <SidebarGroup>
            <SidebarGroupLabel>Switch workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {orgs.map((org) => (
                  <SidebarMenuItem key={org.id}>
                    <SidebarMenuButton
                      isActive={org.slug === currentSlug}
                      render={<Link href={`/dashboard/${org.slug}`} />}
                    >
                      <BuildingIcon className="size-4" />
                      {org.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar size="sm">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOutIcon className="size-4" />
              Sign out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteSite } from "@/lib/actions/sites";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SiteActionsProps {
  siteId: string;
  siteName: string;
  workspaceSlug: string;
}

export default function SiteActions({
  siteId,
  siteName,
  workspaceSlug,
}: SiteActionsProps) {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    console.debug("[START: delete-site-action]", { siteId });
    try {
      await deleteSite({ id: siteId });
      console.debug("[END: delete-site-action]", { siteId });
      toast.success(`${siteName} deleted`);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete site";
      console.debug("[END: delete-site-action] error", { msg });
      toast.error(msg);
    } finally {
      setDeleting(false);
      setAlertOpen(false);
    }
  }

  return (
    <>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {siteName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the site and all its pages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleting} onClick={handleDelete}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon" variant="ghost" />}>
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={
              <Link
                href={`/dashboard/${workspaceSlug}/sites/${siteId}/pages`}
              />
            }
          >
            View pages
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link
                href={`/dashboard/${workspaceSlug}/sites/${siteId}/settings`}
              />
            }
          >
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setAlertOpen(true)}
          >
            Delete site
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

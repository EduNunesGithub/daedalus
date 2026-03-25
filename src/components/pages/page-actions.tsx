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
import { deletePage, updatePageStatus } from "@/lib/actions/pages";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PageActionsProps {
  pageId: string;
  pageTitle: string;
  status: string;
}

export default function PageActions({
  pageId,
  pageTitle,
  status,
}: PageActionsProps) {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStatusToggle() {
    setLoading(true);
    const next = status === "published" ? "draft" : "published";
    console.debug("[START: toggle-page-status]", { pageId, next });
    try {
      await updatePageStatus({ id: pageId, status: next });
      console.debug("[END: toggle-page-status]", { pageId, next });
      toast.success(
        next === "published" ? "Page published" : "Page unpublished",
      );
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update status";
      console.debug("[END: toggle-page-status] error", { msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    console.debug("[START: delete-page-action]", { pageId });
    try {
      await deletePage({ id: pageId });
      console.debug("[END: delete-page-action]", { pageId });
      toast.success(`${pageTitle} deleted`);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete page";
      console.debug("[END: delete-page-action] error", { msg });
      toast.error(msg);
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  }

  return (
    <>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pageTitle}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this page and its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleDelete}>
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button disabled={loading} size="icon" variant="ghost" />}
        >
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleStatusToggle}>
            {status === "published" ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setAlertOpen(true)}
          >
            Delete page
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

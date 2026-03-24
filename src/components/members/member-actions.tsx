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
import { authClient } from "@/lib/auth-client";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface MemberActionsProps {
  currentUserId: string;
  memberId: string;
  memberName: string;
  organizationId: string;
  role: string;
  userId: string;
}

export default function MemberActions({
  currentUserId,
  memberId,
  memberName,
  organizationId,
  role,
  userId,
}: MemberActionsProps) {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    console.debug("[START: remove-member]", { memberId });

    const result = await authClient.organization.removeMember({
      memberIdOrEmail: memberId,
    });

    if (result.error) {
      console.debug("[END: remove-member] error", {
        error: result.error.message,
      });
      toast.error(result.error.message);
      setRemoving(false);
      return;
    }

    console.debug("[END: remove-member]", { memberId });
    toast.success(`${memberName} removed from workspace`);
    router.refresh();
    setAlertOpen(false);
    setRemoving(false);
  }

  async function handleRoleChange(newRole: string) {
    setUpdatingRole(true);
    console.debug("[START: update-role]", { memberId, newRole });

    const result = await authClient.organization.updateMemberRole({
      memberId,
      organizationId,
      role: newRole,
    });

    if (result.error) {
      console.debug("[END: update-role] error", {
        error: result.error.message,
      });
      toast.error(result.error.message);
      setUpdatingRole(false);
      return;
    }

    console.debug("[END: update-role]", { memberId, newRole });
    toast.success("Role updated");
    router.refresh();
    setUpdatingRole(false);
  }

  return (
    <>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {memberName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {memberName} from the workspace. They will lose
              access to all workspace resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={handleRemove}>
              {removing ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button disabled={updatingRole} size="icon" variant="ghost" />
          }
        >
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {role === "member" && (
            <DropdownMenuItem onClick={() => handleRoleChange("admin")}>
              Promote to admin
            </DropdownMenuItem>
          )}
          {role === "admin" && (
            <DropdownMenuItem onClick={() => handleRoleChange("member")}>
              Demote to member
            </DropdownMenuItem>
          )}
          {currentUserId !== userId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setAlertOpen(true)}
              >
                Remove member
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

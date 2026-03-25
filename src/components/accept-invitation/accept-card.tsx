"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { BuildingIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AcceptCardProps {
  invitationId: string;
}

export default function AcceptCard({ invitationId }: AcceptCardProps) {
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);

  async function handleAccept() {
    setAccepting(true);
    console.debug("[START: accept-invitation]", { invitationId });

    const result = await authClient.organization.acceptInvitation({
      invitationId,
    });

    if (result.error) {
      console.debug("[END: accept-invitation] error", {
        error: result.error.message,
      });
      toast.error(result.error.message);
      setAccepting(false);
      return;
    }

    console.debug("[END: accept-invitation]", {
      orgId: result.data?.member.organizationId,
    });

    toast.success("You joined the workspace!");
    router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <BuildingIcon className="size-6 text-primary" />
        </div>
        <CardTitle>You have been invited</CardTitle>
        <CardDescription>
          Accept the invitation to join a workspace on Page Builder.
        </CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter>
        <Button className="w-full" disabled={accepting} onClick={handleAccept}>
          {accepting ? "Accepting..." : "Accept invitation"}
        </Button>
      </CardFooter>
    </Card>
  );
}

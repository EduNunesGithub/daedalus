import AcceptCard from "@/components/accept-invitation/accept-card";
import { getCachedSession } from "@/lib/auth-cache";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AcceptInvitationPage({ params }: Props) {
  const { id } = await params;

  console.debug("[START: accept-invitation-page]", { id });

  const session = await getCachedSession();

  if (!session) {
    console.debug("[END: accept-invitation-page] unauthenticated");
    redirect(`/login?callbackUrl=/accept-invitation/${id}`);
  }

  console.debug("[END: accept-invitation-page]", { userId: session.user.id });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <AcceptCard invitationId={id} />
    </div>
  );
}

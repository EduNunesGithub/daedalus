import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  console.debug("[START: dashboard]");

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    console.debug("[END: dashboard] unauthenticated — redirecting");
    redirect("/login");
  }

  console.debug("[END: dashboard]", { userId: session.user.id });

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {session.user.name}</p>
      </div>
    </div>
  );
}

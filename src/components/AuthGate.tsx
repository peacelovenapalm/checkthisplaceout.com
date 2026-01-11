import type { ReactNode } from "react";
import NotInvited from "@/components/NotInvited";
import { requireActiveProfile } from "@/lib/auth";

export default async function AuthGate({
  children,
  requireAdmin = false
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const sessionProfile = await requireActiveProfile();

  if (!sessionProfile.profile) {
    return <NotInvited email={sessionProfile.email} />;
  }

  if (requireAdmin && sessionProfile.profile.role !== "admin") {
    return (
      <div className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {"// ACCESS_DENIED"}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)] md:text-3xl">
          Admin access required.
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          Ask an admin to grant access to member management.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

import MemberManagement from "@/components/MemberManagement";
import NotInvited from "@/components/NotInvited";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MembersPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const sessionProfile = await requireActiveProfile();

  if (!sessionProfile.profile) {
    return <NotInvited email={sessionProfile.email} />;
  }

  if (sessionProfile.profile.role !== "admin") {
    return (
      <div className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {"// ACCESS_DENIED"}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          Admin access required.
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          Ask an admin to grant access to member management.
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {"// MEMBERS"}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          Manage bartender access
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          Toggle active status or role for invited accounts.
        </p>
      </section>

      {searchParams?.error && (
        <div className="border border-[color:var(--color-red)] bg-[rgba(255,0,60,0.1)] p-4 text-sm text-[color:var(--color-red)]">
          {searchParams.error}
        </div>
      )}

      <MemberManagement profiles={(profiles as Profile[]) ?? []} />
    </div>
  );
}

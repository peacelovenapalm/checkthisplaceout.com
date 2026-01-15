import MemberManagement from "@/components/MemberManagement";
import MembersAdminPanel from "@/components/MembersAdminPanel";
import NotInvited from "@/components/NotInvited";
import { copy } from "@/lib/copy";
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
          {copy.brand.tagline}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          {copy.errors.notAllowedTitle}
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          {copy.errors.notAllowedBody}
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
          {copy.members.title}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          {copy.members.title}
        </h1>
        <div className="space-y-1 text-sm text-[color:var(--text-dim)]">
          <p>{copy.members.helper}</p>
          {copy.members.helperNote && <p>{copy.members.helperNote}</p>}
        </div>
      </section>

      <MembersAdminPanel />

      {searchParams?.error && (
        <div className="border border-[color:var(--color-red)] bg-[rgba(255,0,60,0.1)] p-4 text-sm text-[color:var(--color-red)]">
          {searchParams.error}
        </div>
      )}

      <MemberManagement profiles={(profiles as Profile[]) ?? []} />
    </div>
  );
}

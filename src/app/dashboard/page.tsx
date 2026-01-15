import Link from "next/link";
import PlaceForm from "@/components/PlaceForm";
import NotInvited from "@/components/NotInvited";
import { copy } from "@/lib/copy";
import { requireActiveProfile } from "@/lib/auth";
import { getCategories } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import type { PlaceRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

const formatDate = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString();
};

const PlaceList = ({
  title,
  places,
  emptyLabel,
  helper
}: {
  title: string;
  places: PlaceRecord[];
  emptyLabel: string;
  helper?: string;
}) => {
  return (
    <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="display-title text-lg text-[color:var(--text-hologram)]">
            {title}
          </h2>
          {helper && (
            <p className="mt-1 text-xs text-[color:var(--text-dim)]">
              {helper}
            </p>
          )}
        </div>
        <span className="hud-meta text-[color:var(--text-dim)]">
          {`// ${String(places.length).padStart(2, "0")}`}
        </span>
      </div>
      {places.length ? (
        <div className="space-y-3">
          {places.map((place) => (
            <div
              key={place.id}
              className="panel-muted flex flex-col gap-2 border border-[color:var(--border-color)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[color:var(--text-hologram)]">
                  {place.title}
                </p>
                <span className="hud-meta text-[color:var(--text-dim)]">
                  {place.status.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[color:var(--text-dim)]">
                <span>{`// AREA: ${place.area || "--"}`}</span>
                <span>{`// UPDATED: ${formatDate(place.updated_at)}`}</span>
                <Link
                  className="hover:text-[color:var(--color-cyan)]"
                  href={`/places/${place.id}/edit`}
                >
                  {copy.buttons.edit}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[color:var(--text-dim)]">{emptyLabel}</p>
      )}
    </section>
  );
};

export default async function DashboardPage() {
  const sessionProfile = await requireActiveProfile();

  if (!sessionProfile.profile) {
    return <NotInvited email={sessionProfile.email} />;
  }

  const categories = getCategories();
  const supabase = await createSupabaseServerClient();
  const userId = sessionProfile.userId;

  const { data: drafts } = await supabase
    .from("places")
    .select("*")
    .eq("created_by", userId)
    .eq("status", "draft")
    .order("updated_at", { ascending: false });

  const { data: submissions } = await supabase
    .from("places")
    .select("*")
    .eq("created_by", userId)
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false });

  const { data: submitted } = await supabase
    .from("places")
    .select("*")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true });

  const { data: votes } = await supabase
    .from("votes")
    .select("place_id")
    .eq("voter_id", userId);

  const votedIds = new Set((votes ?? []).map((vote) => vote.place_id));
  const needsVote = (submitted ?? []).filter(
    (place) => place.created_by !== userId && !votedIds.has(place.id)
  );

  const { data: approved } = await supabase
    .from("places")
    .select("*")
    .eq("status", "approved")
    .order("approved_at", { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="hud-meta text-[color:var(--text-dim)]">
              {copy.dashboard.title}
            </p>
            <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
              {copy.dashboard.welcome},{" "}
              {sessionProfile.profile.display_name || "Bartender"}.
            </h1>
          </div>
          <form action={signOut}>
            <button type="submit" className="btn-ghost">
              {copy.buttons.signOut}
            </button>
          </form>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="btn-primary" href="/places/new">
            {copy.buttons.newPlace}
          </Link>
          <Link className="btn-secondary" href="/review">
            {copy.buttons.reviewQueue}
          </Link>
          {sessionProfile.profile.role === "admin" && (
            <Link className="btn-ghost" href="/members">
              {copy.buttons.members}
            </Link>
          )}
        </div>
      </section>

      <section className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {copy.form.newPlaceTitle}
        </p>
        <h2 className="display-title text-2xl text-[color:var(--text-hologram)]">
          {copy.form.newPlaceTitle}
        </h2>
        <p className="text-sm text-[color:var(--text-dim)]">
          {copy.form.newPlaceHelper}
        </p>
      </section>

      <PlaceForm categories={categories} />

      <PlaceList
        title={copy.dashboard.drafts}
        places={(drafts as PlaceRecord[]) ?? []}
        emptyLabel={copy.dashboard.emptyDrafts}
        helper={copy.dashboard.sectionHelper.drafts}
      />

      <PlaceList
        title={copy.dashboard.submitted}
        places={(submissions as PlaceRecord[]) ?? []}
        emptyLabel={copy.dashboard.emptySubmitted}
        helper={copy.dashboard.sectionHelper.submitted}
      />

      <PlaceList
        title={copy.dashboard.needsVote}
        places={(needsVote as PlaceRecord[]) ?? []}
        emptyLabel={copy.dashboard.emptyNeedsVote}
        helper={copy.dashboard.sectionHelper.needsVote}
      />

      <PlaceList
        title={copy.dashboard.approved}
        places={(approved as PlaceRecord[]) ?? []}
        emptyLabel={copy.dashboard.emptyApproved}
      />
    </div>
  );
}

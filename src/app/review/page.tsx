import ReviewQueue from "@/components/ReviewQueue";
import NotInvited from "@/components/NotInvited";
import { copy } from "@/lib/copy";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceRecord, VoteRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const sessionProfile = await requireActiveProfile();

  if (!sessionProfile.profile) {
    return <NotInvited email={sessionProfile.email} />;
  }

  const supabase = await createSupabaseServerClient();
  const { data: places } = await supabase
    .from("places")
    .select("*")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true });

  const placeIds = (places ?? []).map((place) => place.id);
  const { data: votes } = placeIds.length
    ? await supabase.from("votes").select("*").in("place_id", placeIds)
    : { data: [] };

  const entries = (places as PlaceRecord[] | null)?.map((place) => {
    const placeVotes = (votes as VoteRecord[] | null)?.filter(
      (vote) => vote.place_id === place.id
    );
    const yesCount = placeVotes?.filter((vote) => vote.vote === "yes").length ?? 0;
    const noCount = placeVotes?.filter((vote) => vote.vote === "no").length ?? 0;
    const hasVoted =
      placeVotes?.some((vote) => vote.voter_id === sessionProfile.userId) ?? false;

    return { place, yesCount, noCount, hasVoted };
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {copy.review.title}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          {copy.review.title}
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          {copy.review.helper}
        </p>
      </section>

      {searchParams?.error && (
        <div className="border border-[color:var(--color-red)] bg-[rgba(255,0,255,0.12)] p-4 text-sm text-[color:var(--color-red)]">
          {searchParams.error}
        </div>
      )}

      <ReviewQueue
        entries={entries ?? []}
        isAdmin={sessionProfile.profile.role === "admin"}
      />
    </div>
  );
}

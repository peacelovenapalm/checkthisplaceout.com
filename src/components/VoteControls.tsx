import { castVote } from "@/lib/actions/votes";
import { copy } from "@/lib/copy";

export default function VoteControls({
  placeId,
  disabled = false
}: {
  placeId: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <p className="hud-meta text-[color:var(--text-dim)]">
        {copy.review.voteLocked}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <form action={castVote}>
        <input type="hidden" name="placeId" value={placeId} />
        <input type="hidden" name="vote" value="yes" />
        <button type="submit" className="btn-primary">
          {copy.cta.approve}
        </button>
      </form>
      <form action={castVote}>
        <input type="hidden" name="placeId" value={placeId} />
        <input type="hidden" name="vote" value="no" />
        <button type="submit" className="btn-secondary">
          {copy.cta.reject}
        </button>
      </form>
    </div>
  );
}

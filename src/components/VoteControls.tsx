import { castVote } from "@/lib/actions/votes";

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
        {"// VOTE_LOCKED"}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <form action={castVote}>
        <input type="hidden" name="placeId" value={placeId} />
        <input type="hidden" name="vote" value="yes" />
        <button type="submit" className="btn-primary">
          YES
        </button>
      </form>
      <form action={castVote}>
        <input type="hidden" name="placeId" value={placeId} />
        <input type="hidden" name="vote" value="no" />
        <button type="submit" className="btn-secondary">
          NO
        </button>
      </form>
    </div>
  );
}

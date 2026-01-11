import VoteControls from "@/components/VoteControls";
import { adminSetPlaceStatus } from "@/lib/actions/places";
import type { PlaceRecord } from "@/lib/types";

export type ReviewEntry = {
  place: PlaceRecord;
  yesCount: number;
  noCount: number;
  hasVoted: boolean;
};

export default function ReviewQueue({
  entries,
  isAdmin
}: {
  entries: ReviewEntry[];
  isAdmin: boolean;
}) {
  if (!entries.length) {
    return (
      <div className="panel-muted border border-[color:var(--border-color)] p-5">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {"// QUEUE_EMPTY"}
        </p>
        <p className="text-sm text-[color:var(--text-hologram)]">
          No submissions are waiting for votes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {entries.map(({ place, yesCount, noCount, hasVoted }) => (
        <div
          key={place.id}
          className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="hud-meta text-[color:var(--text-dim)]">
                {"// SUBMISSION"}
              </p>
              <h3 className="display-title text-lg text-[color:var(--text-hologram)]">
                {place.title}
              </h3>
              <p className="text-sm text-[color:var(--text-dim)]">
                {place.area}
              </p>
            </div>
            <div className="flex gap-3 text-xs uppercase tracking-[0.24em] text-[color:var(--text-dim)]">
              <span>YES {String(yesCount).padStart(2, "0")}</span>
              <span>NO {String(noCount).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-[color:var(--text-hologram)]">
              {place.description_short || "Draft copy pending."}
            </p>
            <VoteControls placeId={place.id} disabled={hasVoted} />
          </div>

          {isAdmin && (
            <div className="flex flex-wrap gap-3 border-t border-[color:var(--border-color)] pt-4">
              <form action={adminSetPlaceStatus}>
                <input type="hidden" name="placeId" value={place.id} />
                <input type="hidden" name="status" value="approved" />
                <button type="submit" className="btn-primary">
                  ADMIN_APPROVE
                </button>
              </form>
              <form action={adminSetPlaceStatus}>
                <input type="hidden" name="placeId" value={place.id} />
                <input type="hidden" name="status" value="rejected" />
                <button type="submit" className="btn-secondary">
                  ADMIN_REJECT
                </button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

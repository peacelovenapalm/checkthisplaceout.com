import VoteControls from "@/components/VoteControls";
import { adminSetPlaceStatus } from "@/lib/actions/places";
import { copy } from "@/lib/copy";
import type { PlaceRecord } from "@/lib/types";

export type ReviewEntry = {
  place: PlaceRecord;
  yesCount: number;
  noCount: number;
  hasVoted: boolean;
};

const YES_TARGET = 3;

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
          {copy.review.title}
        </p>
        <p className="text-sm text-[color:var(--text-hologram)]">
          {copy.review.empty}
        </p>
        {copy.review.emptyBody && (
          <p className="text-sm text-[color:var(--text-dim)]">
            {copy.review.emptyBody}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {entries.map(({ place, yesCount, noCount, hasVoted }) => {
        const yesProgress = Math.min(yesCount, YES_TARGET) / YES_TARGET;
        const ready = yesCount >= YES_TARGET && yesCount > noCount;

        return (
          <div
            key={place.id}
            className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-5"
          >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="hud-meta text-[color:var(--text-dim)]">
                {copy.review.itemLabel}
              </p>
              <h3 className="display-title text-lg text-[color:var(--text-hologram)]">
                {place.title}
              </h3>
              <p className="text-sm text-[color:var(--text-dim)]">
                {place.area}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-[10px] uppercase tracking-[0.24em] text-[color:var(--text-dim)]">
              <div className="flex gap-3">
                <span>
                  {`${copy.review.yesLabel} ${String(yesCount).padStart(2, "0")}/${String(YES_TARGET).padStart(2, "0")}`}
                </span>
                <span>{`${copy.review.noLabel} ${String(noCount).padStart(2, "0")}`}</span>
              </div>
              <div className="h-1 w-24 border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)]">
                <div
                  className="h-full bg-[color:var(--accent-neon-green)]"
                  style={{ width: `${yesProgress * 100}%` }}
                />
              </div>
              <span
                className={`hud-meta ${
                  ready
                    ? "text-[color:var(--accent-neon-green)]"
                    : "text-[color:var(--text-dim)]"
                }`}
              >
                {ready ? copy.review.statusReady : copy.review.statusNeeds}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-[color:var(--text-hologram)]">
              {place.description_short || copy.review.pendingSummary}
            </p>
            <VoteControls placeId={place.id} disabled={hasVoted} />
          </div>

          {isAdmin && (
            <div className="flex flex-wrap gap-3 border-t border-[color:var(--border-color)] pt-4">
              <form action={adminSetPlaceStatus}>
                <input type="hidden" name="placeId" value={place.id} />
                <input type="hidden" name="status" value="approved" />
                <button type="submit" className="btn-primary">
                  {copy.cta.approve}
                </button>
              </form>
              <form action={adminSetPlaceStatus}>
                <input type="hidden" name="placeId" value={place.id} />
                <input type="hidden" name="status" value="rejected" />
                <button type="submit" className="btn-secondary">
                  {copy.cta.reject}
                </button>
              </form>
            </div>
          )}
          </div>
        );
      })}
    </div>
  );
}

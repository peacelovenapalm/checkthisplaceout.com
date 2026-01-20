"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import type { Place } from "@/lib/types";

export default function OpsPackPanel({
  packPlaces,
  shareUrl,
  canShare,
  max,
  onRemove,
  onClear
}: {
  packPlaces: Place[];
  shareUrl: string;
  canShare: boolean;
  max: number;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    if (!canShare) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <section className="panel-muted flex flex-col gap-4 border border-[color:var(--border-color)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="hud-meta text-[color:var(--text-dim)]">
            {copy.pack.title}
          </p>
          <p className="text-xs text-[color:var(--text-dim)]">
            {copy.pack.helper}
          </p>
        </div>
        <span className="hud-meta text-[color:var(--text-dim)]">
          {`// ${String(packPlaces.length).padStart(2, "0")}/${String(max).padStart(2, "0")}`}
        </span>
      </div>

      <div className="space-y-2">
        {packPlaces.map((place) => (
          <div
            key={place.id}
            className="flex flex-wrap items-center justify-between gap-3 border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2"
          >
            <div>
              <p className="text-sm text-[color:var(--text-hologram)]">
                {place.title}
              </p>
              <p className="text-xs text-[color:var(--text-dim)]">
                {place.area || "--"}
              </p>
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => onRemove(place.id)}
            >
              {copy.pack.remove}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" onClick={onClear}>
          {copy.pack.clear}
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleCopy}
          disabled={!canShare}
        >
          {copy.pack.share}
        </button>
        {(copied || !canShare) && (
          <span className="text-xs text-[color:var(--text-dim)]">
            {copied ? copy.toast.done : copy.pack.needMin}
          </span>
        )}
      </div>

      {canShare && shareUrl && (
        <div className="border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2">
          <p className="text-xs text-[color:var(--text-dim)] break-all">
            {shareUrl}
          </p>
        </div>
      )}
    </section>
  );
}

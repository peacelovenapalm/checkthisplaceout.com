"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BottomSheet from "@/components/BottomSheet";
import MapView from "@/components/MapView.client";
import OpsPackPanel from "@/components/OpsPackPanel";
import { copy } from "@/lib/copy";
import { useOpsPack } from "@/lib/ops-pack";
import type { Place } from "@/lib/types";

export default function HomeMapSection({ places }: { places: Place[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const opsPack = useOpsPack(places.map((place) => place.id));
  const selected = useMemo(
    () => places.find((place) => place.id === selectedId) ?? null,
    [places, selectedId]
  );
  const mapsSecondary = selected?.links.appleMapsUrl ?? null;
  const selectedInPack = selected ? opsPack.packIds.includes(selected.id) : false;
  const packPlaces = useMemo(
    () => places.filter((place) => opsPack.packIds.includes(place.id)),
    [places, opsPack.packIds]
  );

  if (!places.length) {
    return (
      <div className="panel-muted border border-[color:var(--border-color)] p-5">
        <h3 className="display-title text-base text-[color:var(--text-hologram)]">
          {copy.empty.noneApprovedTitle}
        </h3>
        <p className="mt-2 text-sm text-[color:var(--text-dim)]">
          {copy.empty.noneApprovedBody}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MapView
        places={places}
        selectedId={selectedId}
        onSelect={(placeId) => setSelectedId(placeId)}
      />
      <p className="hud-meta text-[color:var(--text-dim)]">
        {copy.categoryList.mapHint}
      </p>
      {opsPack.packIds.length > 0 && (
        <OpsPackPanel
          packPlaces={packPlaces}
          shareUrl={opsPack.shareUrl}
          canShare={opsPack.canShare}
          max={opsPack.max}
          onRemove={opsPack.remove}
          onClear={opsPack.clear}
        />
      )}
      <BottomSheet
        isOpen={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected?.title}
      >
        {selected && (
          <div className="space-y-3">
            <p className="text-sm text-[color:var(--text-hologram)]">
              {selected.description_short || copy.placeDetail.missing.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="btn-primary"
                href={selected.links.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={copy.cta.openMap}
              >
                {copy.cta.openMap}
              </a>
              {mapsSecondary && (
                <a
                  className="btn-secondary"
                  href={mapsSecondary}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={copy.cta.openMapAlt}
                >
                  {copy.cta.openMapAlt}
                </a>
              )}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => opsPack.toggle(selected.id)}
                disabled={!selectedInPack && opsPack.isFull}
              >
                {selectedInPack ? copy.pack.remove : copy.pack.add}
              </button>
              <Link className="btn-ghost" href={`/p/${selected.id}`}>
                {copy.buttons.viewPlace}
              </Link>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

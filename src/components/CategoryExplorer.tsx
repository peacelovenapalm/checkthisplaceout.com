"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MapView from "@/components/MapView";
import PlaceCard from "@/components/PlaceCard";
import BottomSheet from "@/components/BottomSheet";
import OpsPackPanel from "@/components/OpsPackPanel";
import { copy } from "@/lib/copy";
import { useOpsPack } from "@/lib/ops-pack";
import type { Category, Place } from "@/lib/types";

export default function CategoryExplorer({
  category,
  places
}: {
  category: Category;
  places: Place[];
}) {
  const [view, setView] = useState<"list" | "map">("list");
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
      <div className="panel-muted border border-[color:var(--border-color)] p-6">
        <h2 className="display-title text-lg text-[color:var(--text-hologram)]">
          {copy.categoryList.emptyTitle}
        </h2>
        <p className="mt-2 text-sm text-[color:var(--text-dim)]">
          {copy.categoryList.emptyBody}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="panel-muted flex flex-wrap items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-3">
          <Image
            src={category.icon}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 opacity-70"
            aria-hidden="true"
            unoptimized
          />
          <span className="hud-label">{copy.categoryList.viewLabel}</span>
        </div>
        <div
          className="flex items-center gap-2 border border-[color:var(--border-color)] bg-[color:var(--bg-terminal)] p-1"
          role="tablist"
          aria-label={copy.categoryList.toggleAriaLabel}
        >
          <button
            type="button"
            role="tab"
            aria-selected={view === "list"}
            onClick={() => setView("list")}
            className={`btn-base px-3 py-1 text-[10px] ${
              view === "list"
                ? "bg-[color:var(--accent-acid-yellow)] text-[color:var(--bg-terminal-black)]"
                : "text-[color:var(--text-dim)]"
            }`}
          >
            {copy.categoryList.toggleList}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "map"}
            onClick={() => setView("map")}
            className={`btn-base px-3 py-1 text-[10px] ${
              view === "map"
                ? "bg-[color:var(--accent-acid-yellow)] text-[color:var(--bg-terminal-black)]"
                : "text-[color:var(--text-dim)]"
            }`}
          >
            {copy.categoryList.toggleMap}
          </button>
        </div>
      </div>

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

      {view === "list" ? (
        <div className="grid gap-5">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              packState={{
                isInPack: opsPack.packIds.includes(place.id),
                isFull: opsPack.isFull,
                onToggle: () => opsPack.toggle(place.id)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <MapView
            places={places}
            selectedId={selectedId}
            onSelect={(placeId) => setSelectedId(placeId)}
          />
          <p className="hud-meta text-[color:var(--text-dim)]">
            {copy.categoryList.mapHint}
          </p>
          <BottomSheet
            isOpen={Boolean(selected)}
            onClose={() => setSelectedId(null)}
            title={selected?.name}
          >
            {selected && (
              <div className="space-y-3">
                <p className="text-sm text-[color:var(--text-body)]">
                  {selected.oneLiner || copy.placeDetail.missing.description}
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
      )}
    </div>
  );
}

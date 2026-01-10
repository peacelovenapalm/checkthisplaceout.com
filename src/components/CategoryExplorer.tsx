"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MapView from "@/components/MapView";
import PlaceCard from "@/components/PlaceCard";
import BottomSheet from "@/components/BottomSheet";
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

  const selected = useMemo(
    () => places.find((place) => place.id === selectedId) ?? null,
    [places, selectedId]
  );

  const mapsSecondary = selected?.links.appleMapsUrl ?? selected?.links.googleMapsUrl;

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
          <span className="hud-label">View mode</span>
        </div>
        <div
          className="flex items-center gap-2 border border-[color:var(--border-color)] bg-[color:var(--bg-terminal)] p-1"
          role="tablist"
          aria-label="Toggle list or map view"
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
            DATA_LIST
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
            SAT_VIEW
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="grid gap-5">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
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
            // TAP PIN FOR QUICK_ACTIONS
          </p>
          <BottomSheet
            isOpen={Boolean(selected)}
            onClose={() => setSelectedId(null)}
            title={selected?.name}
          >
            {selected && (
              <div className="space-y-3">
                <p className="text-sm text-[color:var(--text-body)]">
                  {selected.oneLiner}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    className="btn-primary"
                    href={selected.links.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Directions"
                  >
                    INIT_ROUTE
                  </a>
                  {mapsSecondary && (
                    <a
                      className="btn-secondary"
                      href={mapsSecondary}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open in Maps"
                    >
                      EXT_APP_LAUNCH
                    </a>
                  )}
                  <Link className="btn-ghost" href={`/p/${selected.id}`}>
                    OPEN_FILE
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

"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";
import type { Place } from "@/lib/types";

type TabKey = "story" | "specs" | "links";

const formatPhoneHref = (phone?: string) => {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9+]/g, "");
  return digits ? `tel:${digits}` : undefined;
};

export default function PlaceDetailTabs({ place }: { place: Place }) {
  const [activeTab, setActiveTab] = useState<TabKey>("story");
  const phoneHref = formatPhoneHref(place.links.phone);
  const mapsSecondary = place.links.appleMapsUrl ?? null;
  const warnings = Array.isArray(place.warnings)
    ? place.warnings
    : [];
  const hasExtraLinks = Boolean(
    place.links.instagramUrl || place.links.websiteUrl || phoneHref
  );
  const lat = place.lat.toFixed(4);
  const lng = place.lng.toFixed(4);

  return (
    <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-4 md:hidden">
      <div className="flex items-center gap-2 border border-[color:var(--border-color)] bg-[color:var(--bg-terminal)] p-1">
        <button
          type="button"
          className={`btn-base px-3 py-2 text-[10px] ${
            activeTab === "story"
              ? "bg-[color:var(--accent-cyber-yellow)] text-[color:var(--bg-terminal-black)]"
              : "text-[color:var(--text-dim)]"
          }`}
          onClick={() => setActiveTab("story")}
        >
          {copy.placeDetail.tabs.story}
        </button>
        <button
          type="button"
          className={`btn-base px-3 py-2 text-[10px] ${
            activeTab === "specs"
              ? "bg-[color:var(--accent-cyber-yellow)] text-[color:var(--bg-terminal-black)]"
              : "text-[color:var(--text-dim)]"
          }`}
          onClick={() => setActiveTab("specs")}
        >
          {copy.placeDetail.tabs.specs}
        </button>
        <button
          type="button"
          className={`btn-base px-3 py-2 text-[10px] ${
            activeTab === "links"
              ? "bg-[color:var(--accent-cyber-yellow)] text-[color:var(--bg-terminal-black)]"
              : "text-[color:var(--text-dim)]"
          }`}
          onClick={() => setActiveTab("links")}
        >
          {copy.placeDetail.tabs.links}
        </button>
      </div>

      {activeTab === "story" && (
        <div className="space-y-4 text-sm text-[color:var(--text-hologram)]">
          <div>
            <p className="hud-meta text-[color:var(--text-dim)]">
              {`// ${copy.placeDetail.sections.whyGo}`}
            </p>
            <p className="mt-2">
              {place.story || copy.placeDetail.missing.story}
            </p>
          </div>
          <div className="grid gap-3">
            <div>
              <p className="hud-label">{copy.placeDetail.sections.whatToOrder}</p>
              <p className="mt-2">
                {place.signature_move || copy.placeDetail.missing.signature}
              </p>
            </div>
            <div>
              <p className="hud-label">{copy.placeDetail.sections.bestTime}</p>
              <p className="mt-2">{place.best_time || "--"}</p>
            </div>
            {warnings.length > 0 && (
              <div>
                <p className="hud-label">{copy.placeDetail.warningsLabel}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "specs" && (
        <div className="grid gap-3 text-sm text-[color:var(--text-hologram)]">
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.oneLiner}</span>
            <p>{place.description_short || copy.placeDetail.missing.description}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.price}</span>
            <p>{place.price || "N/A"}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.area}</span>
            <p>{place.area || "--"}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.latitude}</span>
            <p>{lat}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.longitude}</span>
            <p>{lng}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.vibes}</span>
            <p>{place.vibes.join(", ") || "--"}</p>
          </div>
        </div>
      )}

      {activeTab === "links" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <a
              className="btn-primary w-full"
              href={place.links.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.cta.openMap}
            >
              {copy.cta.openMap}
            </a>
            {mapsSecondary && (
              <a
                className="btn-secondary w-full"
                href={mapsSecondary}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={copy.cta.openMapAlt}
              >
                {copy.cta.openMapAlt}
              </a>
            )}
            {place.links.websiteUrl && (
              <a
                className="btn-ghost w-full"
                href={place.links.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.links.website}
              </a>
            )}
            {place.links.instagramUrl && (
              <a
                className="btn-ghost w-full"
                href={place.links.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.links.instagram}
              </a>
            )}
            {phoneHref && (
              <a className="btn-ghost w-full" href={phoneHref}>
                {copy.links.call}
              </a>
            )}
          </div>
          {!hasExtraLinks && (
            <p className="text-xs text-[color:var(--text-dim)]">
              {copy.placeDetail.missing.links}
            </p>
          )}
          <p className="text-xs text-[color:var(--text-dim)]">
            {copy.placeDetail.topActionHelper}
          </p>
        </div>
      )}
    </section>
  );
}

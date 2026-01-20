"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import TagPill from "@/components/TagPill";
import { copy } from "@/lib/copy";
import type { Place } from "@/lib/types";

const formatPhoneHref = (phone?: string) => {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9+]/g, "");
  return digits ? `tel:${digits}` : undefined;
};

export default function PlaceCard({
  place,
  packState
}: {
  place: Place;
  packState?: {
    isInPack: boolean;
    isFull: boolean;
    onToggle: () => void;
  };
}) {
  const reduceMotion = useReducedMotion();
  const phoneHref = formatPhoneHref(place.links.phone);
  const mapsSecondary = place.links.appleMapsUrl ?? null;
  const imageSrc = place.images?.[0];
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" }
      };

  return (
    <motion.article
      {...motionProps}
      className="place-card group"
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="hud-meta text-[color:var(--text-dim)]">
              {`// ${copy.labels.fileId}: ${place.id}`}
            </p>
            <h3 className="display-title text-lg text-[color:var(--text-hologram)] sm:text-xl">
              {place.name}
            </h3>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent-electric-cyan)]">
              {`// ${copy.labels.area}: ${place.area}`}
            </span>
            {place.price ? (
              <span className="border border-[color:var(--accent-cyber-yellow)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-cyber-yellow)]">
                {copy.labels.price} {place.price}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {imageSrc ? (
            <div className="image-frame h-40 w-full sm:h-32 sm:w-40 sm:flex-shrink-0">
              <Image
                src={imageSrc}
                alt={place.name}
                width={320}
                height={240}
                className="image-glitch h-full w-full object-cover"
                sizes="(max-width: 640px) 100vw, 160px"
                unoptimized
              />
            </div>
          ) : null}
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-sm text-[color:var(--text-hologram)]">
              {place.oneLiner || copy.placeDetail.missing.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {place.vibes.map((vibe) => (
                <TagPill key={vibe} label={vibe} />
              ))}
            </div>

            <div>
              <p className="hud-meta text-[color:var(--text-dim)]">
                {`// ${copy.placeDetail.sections.links}`}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  className="btn-primary"
                  href={place.links.googleMapsUrl}
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
                {packState && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={packState.onToggle}
                    disabled={!packState.isInPack && packState.isFull}
                  >
                    {packState.isInPack ? copy.pack.remove : copy.pack.add}
                  </button>
                )}
                <Link className="btn-ghost" href={`/p/${place.id}`}>
                  {copy.buttons.viewPlace}
                </Link>
              </div>
            </div>

            {(place.links.instagramUrl ||
              place.links.websiteUrl ||
              phoneHref) && (
              <div className="space-y-2">
                <p className="hud-meta text-[color:var(--text-dim)]">
                  {`// ${copy.placeDetail.externalLinksLabel}`}
                </p>
                <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-dim)]">
                  {place.links.instagramUrl && (
                    <a
                      className="hover:text-[color:var(--color-cyan)]"
                      href={place.links.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {copy.links.instagram}
                    </a>
                  )}
                  {place.links.websiteUrl && (
                    <a
                      className="hover:text-[color:var(--color-cyan)]"
                      href={place.links.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {copy.links.website}
                    </a>
                  )}
                  {phoneHref && (
                    <a
                      className="hover:text-[color:var(--color-cyan)]"
                      href={phoneHref}
                    >
                      {copy.links.call}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

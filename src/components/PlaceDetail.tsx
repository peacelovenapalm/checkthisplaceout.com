import Image from "next/image";
import TagPill from "@/components/TagPill";
import PlaceDetailTabs from "@/components/PlaceDetailTabs";
import { copy } from "@/lib/copy";
import type { Place } from "@/lib/types";

const formatPhoneHref = (phone?: string) => {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9+]/g, "");
  return digits ? `tel:${digits}` : undefined;
};

export default function PlaceDetail({ place }: { place: Place }) {
  const phoneHref = formatPhoneHref(place.links.phone);
  const mapsSecondary = place.links.appleMapsUrl ?? null;
  const warnings = Array.isArray(place.warnings)
    ? place.warnings
    : place.warnings
    ? [place.warnings]
    : [];
  const heroImage = place.images?.[0];
  const galleryImages = place.images?.slice(1) ?? [];
  const hasImages = Boolean(heroImage) || galleryImages.length > 0;
  const lat = place.lat.toFixed(4);
  const lng = place.lng.toFixed(4);
  const hasExtraLinks = Boolean(
    place.links.instagramUrl || place.links.websiteUrl || phoneHref
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        {heroImage && (
          <div className="image-frame relative h-[240px] sm:h-[320px] md:h-[380px]">
            <Image
              src={heroImage}
              alt={`${place.name} hero`}
              fill
              className="image-glitch hero-glitch object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              unoptimized
              priority
            />
          </div>
        )}
        {!hasImages && (
          <div className="panel-muted border border-[color:var(--border-color)] p-5 text-sm text-[color:var(--text-dim)]">
            {copy.placeDetail.missing.images}
          </div>
        )}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="hud-meta text-[color:var(--text-dim)]">
              {`// ${copy.labels.fileId}: ${place.id}`}
            </span>
            <span className="hud-meta text-[color:var(--accent-electric-cyan)]">
              {`// ${copy.labels.area}: ${place.area}`}
            </span>
            {place.price && (
              <span className="border border-[color:var(--accent-radical-red)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-radical-red)]">
                {copy.labels.price} {place.price}
              </span>
            )}
          </div>
          <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
            {place.name}
          </h1>
          {place.vibes.length > 0 && (
            <div className="space-y-2">
              <p className="hud-label">{copy.placeDetail.sections.vibe}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-dim)]">
                {place.vibes.map((vibe) => (
                  <TagPill key={vibe} label={vibe} />
                ))}
              </div>
            </div>
          )}
        </div>
        {galleryImages.length > 0 && (
          <div className="panel flex snap-x snap-mandatory gap-4 overflow-x-auto border border-[color:var(--border-color)] p-4">
            {galleryImages.map((src, index) => (
              <div
                key={`${place.id}-gallery-${index}`}
                className="image-frame relative h-48 min-w-[70%] snap-center sm:min-w-[45%]"
              >
                <Image
                  src={src}
                  alt={`${place.name} photo ${index + 2}`}
                  fill
                  className="image-glitch object-cover"
                  sizes="(max-width: 768px) 70vw, 45vw"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <PlaceDetailTabs place={place} />

      <section className="panel hidden flex-col gap-6 border border-[color:var(--border-color)] p-5 text-base md:flex">
        <div>
          <p className="hud-meta text-[color:var(--text-dim)]">
            {`// ${copy.placeDetail.sections.whyGo}`}
          </p>
          <h2 className="display-title text-lg text-[color:var(--accent-electric-cyan)]">
            {copy.placeDetail.sections.whyGo}
          </h2>
          <p className="mt-2 text-[color:var(--text-hologram)]">
            {place.story || copy.placeDetail.missing.story}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="hud-label">{copy.placeDetail.sections.whatToOrder}</h3>
            <p className="mt-2 text-[color:var(--text-hologram)]">
              {place.signatureMove || copy.placeDetail.missing.signature}
            </p>
          </div>
          <div>
            <h3 className="hud-label">{copy.placeDetail.sections.bestTime}</h3>
            <p className="mt-2 text-[color:var(--text-hologram)]">
              {place.bestTime}
            </p>
          </div>
          {warnings.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="hud-label">{copy.placeDetail.warningsLabel}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[color:var(--text-hologram)]">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          {place.accessibilityNotes && (
            <div className="md:col-span-2">
              <h3 className="hud-label">Accessibility</h3>
              <p className="mt-2 text-[color:var(--text-hologram)]">
                {place.accessibilityNotes}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="hidden space-y-3 md:block">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {`// ${copy.placeDetail.specsLabel}`}
        </p>
        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.oneLiner}</span>
            <p className="text-[color:var(--text-hologram)]">
              {place.oneLiner || copy.placeDetail.missing.description}
            </p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.price}</span>
            <p className="text-[color:var(--text-hologram)]">
              {place.price || "N/A"}
            </p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.area}</span>
            <p className="text-[color:var(--text-hologram)]">{place.area}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.latitude}</span>
            <p className="text-[color:var(--text-hologram)]">{lat}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.longitude}</span>
            <p className="text-[color:var(--text-hologram)]">{lng}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">{copy.placeDetail.specs.vibes}</span>
            <p className="text-[color:var(--text-hologram)]">
              {place.vibes.join(", ")}
            </p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 hidden border-t border-[color:var(--border-color)] bg-[rgba(5,5,5,0.96)] px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 backdrop-blur md:static md:block md:border md:border-[color:var(--border-color)] md:bg-[color:var(--bg-terminal)] md:p-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <p className="hud-meta text-[color:var(--text-dim)]">
            {`// ${copy.placeDetail.sections.links}`}
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            <a
              className="btn-primary w-full md:w-auto"
              href={place.links.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.cta.openMap}
            >
              {copy.cta.openMap}
            </a>
            {mapsSecondary && (
              <a
                className="btn-secondary w-full md:w-auto"
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
                className="btn-ghost w-full md:w-auto"
                href={place.links.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.links.website}
              </a>
            )}
            {place.links.instagramUrl && (
              <a
                className="btn-ghost w-full md:w-auto"
                href={place.links.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.links.instagram}
              </a>
            )}
            {phoneHref && (
              <a className="btn-ghost w-full md:w-auto" href={phoneHref}>
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
      </div>
    </div>
  );
}

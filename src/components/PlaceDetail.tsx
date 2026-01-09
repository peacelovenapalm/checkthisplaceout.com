import Image from "next/image";
import TagPill from "@/components/TagPill";
import type { Place } from "@/lib/types";

const formatPhoneHref = (phone?: string) => {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9+]/g, "");
  return digits ? `tel:${digits}` : undefined;
};

export default function PlaceDetail({ place }: { place: Place }) {
  const phoneHref = formatPhoneHref(place.links.phone);
  const mapsSecondary = place.links.appleMapsUrl ?? place.links.googleMapsUrl;
  const warnings = Array.isArray(place.warnings)
    ? place.warnings
    : place.warnings
    ? [place.warnings]
    : [];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="space-y-2">
          <p className="hud-meta text-[color:var(--text-muted)]">
            // ZONE: {place.area}
          </p>
          <h1 className="display-title text-3xl text-[color:var(--text-body)] md:text-4xl">
            {place.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-muted)]">
            {place.price && (
              <span className="border border-[color:var(--color-yellow)] px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-yellow)]">
                {place.price}
              </span>
            )}
            {place.vibes.map((vibe) => (
              <TagPill key={vibe} label={vibe} />
            ))}
          </div>
        </div>
        {place.images && place.images.length > 0 && (
          <div className="panel flex snap-x snap-mandatory gap-4 overflow-x-auto border-2 border-[color:var(--border-color)] p-4">
            {place.images.map((src, index) => (
              <div
                key={`${place.id}-${index}`}
                className="image-frame relative h-56 min-w-[70%] snap-center sm:min-w-[45%]"
              >
                <Image
                  src={src}
                  alt={`${place.name} photo ${index + 1}`}
                  fill
                  className="image-glitch object-cover"
                  sizes="(max-width: 768px) 70vw, 45vw"
                  unoptimized
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel flex flex-col gap-4 border-2 border-[color:var(--border-color)] p-5 text-base">
        <div>
          <h2 className="display-title text-lg text-[color:var(--color-cyan)]">
            Friend text
          </h2>
          <p className="mt-2 text-[color:var(--text-body)]">{place.story}</p>
        </div>
        <div>
          <h3 className="hud-label">Signature move</h3>
          <p className="mt-2 text-[color:var(--text-body)]">
            {place.signatureMove}
          </p>
        </div>
        <div>
          <h3 className="hud-label">Best time</h3>
          <p className="mt-2 text-[color:var(--text-body)]">{place.bestTime}</p>
        </div>
        {warnings.length > 0 && (
          <div>
            <h3 className="hud-label">Heads up</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[color:var(--text-body)]">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
        {place.accessibilityNotes && (
          <div>
            <h3 className="hud-label">Accessibility</h3>
            <p className="mt-2 text-[color:var(--text-body)]">
              {place.accessibilityNotes}
            </p>
          </div>
        )}
      </section>

      <section className="grid gap-3 text-sm text-[color:var(--text-muted)] sm:grid-cols-3">
        <div className="panel-muted flex flex-col gap-2 p-4">
          <span className="hud-label">Why it lands</span>
          <p>{place.oneLiner}</p>
        </div>
        <div className="panel-muted flex flex-col gap-2 p-4">
          <span className="hud-label">Area</span>
          <p>{place.area}</p>
        </div>
        <div className="panel-muted flex flex-col gap-2 p-4">
          <span className="hud-label">Vibe check</span>
          <p>{place.vibes.join(", ")}</p>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[color:var(--border-color)] bg-[rgba(10,10,12,0.96)] px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 backdrop-blur md:static md:border-2 md:border-[color:var(--border-color)] md:bg-[color:var(--bg-terminal)] md:p-4 md:shadow-[6px_6px_0_var(--shadow-ink)]">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          <a
            className="btn-primary w-full md:w-auto"
            href={place.links.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions
          </a>
          <a
            className="btn-secondary w-full md:w-auto"
            href={mapsSecondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Maps
          </a>
          {place.links.websiteUrl && (
            <a
              className="btn-ghost w-full md:w-auto"
              href={place.links.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          )}
          {place.links.instagramUrl && (
            <a
              className="btn-ghost w-full md:w-auto"
              href={place.links.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          )}
          {phoneHref && (
            <a className="btn-ghost w-full md:w-auto" href={phoneHref}>
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

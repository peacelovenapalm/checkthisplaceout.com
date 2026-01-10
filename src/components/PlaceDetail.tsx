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
  const heroImage = place.images?.[0];
  const galleryImages = place.images?.slice(1) ?? [];
  const lat = place.lat.toFixed(4);
  const lng = place.lng.toFixed(4);

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
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="hud-meta text-[color:var(--text-dim)]">
              // FILE_ID: {place.id}
            </span>
            <span className="hud-meta text-[color:var(--accent-electric-cyan)]">
              // ZONE: {place.area}
            </span>
            {place.price && (
              <span className="border border-[color:var(--accent-radical-red)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-radical-red)]">
                PRICE {place.price}
              </span>
            )}
          </div>
          <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
            {place.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-dim)]">
            {place.vibes.map((vibe) => (
              <TagPill key={vibe} label={vibe} />
            ))}
          </div>
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

      <section className="panel flex flex-col gap-6 border border-[color:var(--border-color)] p-5 text-base">
        <div>
          <p className="hud-meta text-[color:var(--text-dim)]">
            // FRIEND_TEXT
          </p>
          <h2 className="display-title text-lg text-[color:var(--accent-electric-cyan)]">
            Field notes
          </h2>
          <p className="mt-2 text-[color:var(--text-hologram)]">
            {place.story}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="hud-label">Signature move</h3>
            <p className="mt-2 text-[color:var(--text-hologram)]">
              {place.signatureMove}
            </p>
          </div>
          <div>
            <h3 className="hud-label">Best time</h3>
            <p className="mt-2 text-[color:var(--text-hologram)]">
              {place.bestTime}
            </p>
          </div>
          {warnings.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="hud-label">Heads up</h3>
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

      <section className="space-y-3">
        <p className="hud-meta text-[color:var(--text-dim)]">
          // TECHNICAL_SPECS
        </p>
        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">Signal</span>
            <p className="text-[color:var(--text-hologram)]">{place.oneLiner}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">Price</span>
            <p className="text-[color:var(--text-hologram)]">
              {place.price || "N/A"}
            </p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">Area</span>
            <p className="text-[color:var(--text-hologram)]">{place.area}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">Latitude</span>
            <p className="text-[color:var(--text-hologram)]">{lat}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">Longitude</span>
            <p className="text-[color:var(--text-hologram)]">{lng}</p>
          </div>
          <div className="panel-muted flex flex-col gap-2 p-4">
            <span className="hud-label">Vibes</span>
            <p className="text-[color:var(--text-hologram)]">
              {place.vibes.join(", ")}
            </p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[color:var(--border-color)] bg-[rgba(5,5,5,0.96)] px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 backdrop-blur md:static md:border md:border-[color:var(--border-color)] md:bg-[color:var(--bg-terminal)] md:p-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <p className="hud-meta text-[color:var(--text-dim)]">
            // COMMAND_BAR
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            <a
              className="btn-primary w-full md:w-auto"
              href={place.links.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Directions"
            >
              INIT_ROUTE
            </a>
            <a
              className="btn-secondary w-full md:w-auto"
              href={mapsSecondary}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in Maps"
            >
              EXT_APP_LAUNCH
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
    </div>
  );
}

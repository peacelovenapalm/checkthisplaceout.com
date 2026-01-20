"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { copy } from "@/lib/copy";
import type { Category, PlaceRecord } from "@/lib/types";
import { upsertPlace } from "@/lib/actions/places";

const initialState = { error: undefined };

const SubmitButton = ({
  label,
  intent
}: {
  label: string;
  intent: "save" | "submit";
}) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      className={intent === "submit" ? "btn-primary" : "btn-secondary"}
      disabled={pending}
    >
      {pending ? copy.system.loading : label}
    </button>
  );
};

export default function PlaceForm({
  categories,
  place
}: {
  categories: Category[];
  place?: PlaceRecord | null;
}) {
  const [state, formAction] = useActionState(upsertPlace, initialState);
  const selectedCategories = new Set(place?.categories ?? []);
  const vibes = place?.vibes?.join(", ") ?? "";
  const images = Array.isArray(place?.images) ? place?.images.join(", ") : "";
  const warnings = Array.isArray(place?.warnings) ? place?.warnings.join(", ") : "";
  const links = place?.links ?? { googleMapsUrl: "" };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="placeId" value={place?.id ?? ""} />

      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="display-title text-lg text-[color:var(--text-hologram)]">
            {copy.form.basicsTitle}
          </h2>
          <span className="hud-meta text-[color:var(--text-dim)]">
            {copy.form.requiredLabel}
          </span>
        </div>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.titleLabel}</span>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.form.titleHelper}
          </span>
          <input
            name="title"
            defaultValue={place?.title ?? ""}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="Neon Garden"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.areaLabel}</span>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.form.areaHelper}
          </span>
          <input
            name="area"
            defaultValue={place?.area ?? ""}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="Arts District"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.oneLinerLabel}</span>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.form.oneLinerHelper}
          </span>
          <input
            name="description_short"
            defaultValue={place?.description_short ?? ""}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="Low-light cocktails with velvet booths."
          />
        </label>
        <div className="space-y-3">
          <span className="hud-label">{copy.form.categoriesLabel}</span>
          <p className="text-xs text-[color:var(--text-dim)]">
            {copy.form.categoriesHelper}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex items-center gap-2 text-sm text-[color:var(--text-hologram)]"
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={category.slug}
                  defaultChecked={selectedCategories.has(category.slug)}
                  className="h-4 w-4"
                />
                {category.title}
              </label>
            ))}
          </div>
        </div>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.vibesLabel}</span>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.form.vibesHelper}
          </span>
          <input
            name="vibes"
            defaultValue={vibes}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="moody, date-night, vinyl"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.priceLabel}</span>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.form.priceHelper}
          </span>
          <select
            name="price"
            defaultValue={place?.price ?? ""}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
          >
            <option value="">Select</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
          </select>
        </label>
      </section>

      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="display-title text-lg text-[color:var(--text-hologram)]">
            {copy.form.locationTitle}
          </h2>
          <span className="hud-meta text-[color:var(--text-dim)]">
            {copy.form.coordinatesLabel}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.form.latitudeLabel}</span>
            <input
              type="number"
              step="any"
              name="lat"
              defaultValue={place?.lat ?? ""}
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="36.1699"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.form.longitudeLabel}</span>
            <input
              type="number"
              step="any"
              name="lng"
              defaultValue={place?.lng ?? ""}
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="-115.1398"
            />
          </label>
        </div>
      </section>

      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="display-title text-lg text-[color:var(--text-hologram)]">
            {copy.form.storyTitle}
          </h2>
          <span className="hud-meta text-[color:var(--text-dim)]">
            {copy.form.notesLabel}
          </span>
        </div>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.storyLabel}</span>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.form.storyHelper}
          </span>
          <textarea
            name="story"
            defaultValue={place?.story ?? ""}
            className="min-h-[140px] w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="Short and clear."
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.form.signatureMoveLabel}</span>
            <span className="text-xs text-[color:var(--text-dim)]">
              {copy.form.signatureMoveHelper}
            </span>
            <input
              name="signature_move"
              defaultValue={place?.signature_move ?? ""}
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="Order the mezcal old fashioned."
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.form.bestTimeLabel}</span>
            <span className="text-xs text-[color:var(--text-dim)]">
              {copy.form.bestTimeHelper}
            </span>
            <input
              name="best_time"
              defaultValue={place?.best_time ?? ""}
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="Weeknight after 9pm."
            />
          </label>
        </div>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.warningsLabel}</span>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.form.warningsHelper}
          </span>
          <textarea
            name="warnings"
            defaultValue={warnings}
            className="min-h-[90px] w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="Loud. Long wait. Cash only."
          />
        </label>
      </section>

      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="display-title text-lg text-[color:var(--text-hologram)]">
            {copy.form.linksTitle}
          </h2>
          <span className="hud-meta text-[color:var(--text-dim)]">
            {copy.form.mapsLabel}
          </span>
        </div>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.googleMapsLabel}</span>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.form.googleMapsHelper}
          </span>
          <input
            name="googleMapsUrl"
            defaultValue={links.googleMapsUrl ?? ""}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="https://maps.google.com/..."
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.appleMapsLabel}</span>
          <input
            name="appleMapsUrl"
            defaultValue={links.appleMapsUrl ?? ""}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="https://maps.apple.com/..."
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.form.instagramLabel}</span>
            <input
              name="instagramUrl"
              defaultValue={links.instagramUrl ?? ""}
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="https://instagram.com/..."
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.form.websiteLabel}</span>
            <input
              name="websiteUrl"
              defaultValue={links.websiteUrl ?? ""}
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="https://..."
            />
          </label>
        </div>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.phoneLabel}</span>
          <input
            name="phone"
            defaultValue={links.phone ?? ""}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="(702) 555-0101"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="hud-label">{copy.form.imagesLabel}</span>
          <input
            name="images"
            defaultValue={images}
            className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            placeholder="https://.../hero.jpg, https://.../bar.jpg"
          />
        </label>
      </section>

      {state.error && (
        <div className="border border-[color:var(--color-red)] bg-[rgba(255,0,255,0.12)] p-4 text-sm text-[color:var(--color-red)]">
          {state.error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <SubmitButton label={copy.cta.saveDraft} intent="save" />
        <SubmitButton label={copy.cta.submitVote} intent="submit" />
      </div>
    </form>
  );
}

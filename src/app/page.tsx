import CategoryTile from "@/components/CategoryTile";
import HomeMapSection from "@/components/HomeMapSection";
import { copy } from "@/lib/copy";
import { getCategories } from "@/lib/data";
import { getApprovedPlaces } from "@/lib/places";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = getCategories();
  const places = await getApprovedPlaces();
  const counts = new Map<string, number>();

  places.forEach((place) => {
    place.categories.forEach((slug) => {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    });
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {copy.brand.tagline}
        </p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          {copy.hero.headline}
        </h1>
        <p className="max-w-2xl text-base text-[color:var(--text-dim)]">
          {copy.hero.subtext}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a className="btn-primary" href="#categories">
            {copy.cta.browse}
          </a>
          <a className="btn-secondary" href="#map">
            {copy.buttons.openMapView}
          </a>
          <span className="text-xs text-[color:var(--text-dim)]">
            {copy.hero.helper}
          </span>
        </div>
      </section>

      <section id="categories" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="display-title text-2xl text-[color:var(--text-hologram)]">
            {copy.home.sectionTitle}
          </h2>
          <p className="text-sm text-[color:var(--text-dim)]">
            {copy.home.sectionHelper}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryTile
              key={category.slug}
              category={category}
              count={counts.get(category.slug) ?? 0}
            />
          ))}
        </div>
      </section>

      <section id="map" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="display-title text-2xl text-[color:var(--text-hologram)]">
            {copy.home.mapTitle}
          </h2>
          <p className="text-sm text-[color:var(--text-dim)]">
            {copy.home.mapHelper}
          </p>
        </div>
        <HomeMapSection places={places} />
      </section>
    </div>
  );
}

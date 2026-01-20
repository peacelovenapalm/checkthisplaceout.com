import CategoryTile from "@/components/CategoryTile";
import { copy } from "@/lib/copy";
import { getCategories } from "@/lib/data";
import { getApprovedPlaces } from "@/lib/places";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = getCategories();
  const places = await getApprovedPlaces();
  const counts = new Map<string, number>();

  places.forEach((place) => {
    place.categories.forEach((slug) => {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    });
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {copy.categoriesPage.helper}
        </p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          {copy.categoriesPage.title}
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          {copy.hero.helper}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile
            key={category.slug}
            category={category}
            count={counts.get(category.slug) ?? 0}
          />
        ))}
      </section>
    </div>
  );
}

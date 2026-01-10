import { notFound } from "next/navigation";
import CategoryExplorer from "@/components/CategoryExplorer";
import { getCategoryBySlug, getPlacesByCategory } from "@/lib/data";

export default function CategoryPage({
  params
}: {
  params: { category: string };
}) {
  const category = getCategoryBySlug(params.category);
  if (!category) return notFound();

  const places = getPlacesByCategory(category.slug);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          // {places.length} picks
        </p>
        <p className="hud-meta text-[color:var(--text-dim)]">
          // ACCESSING_LOCAL_DB
        </p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          {category.title}
        </h1>
        <p className="max-w-2xl text-base text-[color:var(--text-dim)]">
          {category.caption}
        </p>
      </header>
      <CategoryExplorer category={category} places={places} />
    </div>
  );
}

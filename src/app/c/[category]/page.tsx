import { notFound } from "next/navigation";
import CategoryExplorer from "@/components/CategoryExplorer";
import { copy } from "@/lib/copy";
import { getCategoryBySlug } from "@/lib/data";
import { getApprovedPlacesByCategory } from "@/lib/places";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return notFound();

  const places = await getApprovedPlacesByCategory(category.slug);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {copy.categoryList.header}
        </p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          {category.title}
        </h1>
        <p className="max-w-2xl text-base text-[color:var(--text-dim)]">
          {category.caption}
        </p>
        <p className="text-sm text-[color:var(--text-dim)]">
          {copy.categoryList.helper}
        </p>
      </header>
      <CategoryExplorer category={category} places={places} />
    </div>
  );
}

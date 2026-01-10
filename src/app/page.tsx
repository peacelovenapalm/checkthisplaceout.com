import CategoryTile from "@/components/CategoryTile";
import { getCategories } from "@/lib/data";

export default function HomePage() {
  const categories = getCategories();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          // ACCESSING_LOCAL_DB
        </p>
        <p className="hud-label">Local friend mode</p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          You just scanned the QR. Pick a vibe and go.
        </h1>
        <p className="max-w-2xl text-base text-[color:var(--text-dim)]">
          These are the spots I send people when they want a sure win in
          Vegas. Tap a category, scan the list, hit INIT_ROUTE.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile key={category.slug} category={category} />
        ))}
      </section>
    </div>
  );
}

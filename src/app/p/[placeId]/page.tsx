import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceDetail from "@/components/PlaceDetail";
import { getCategoryBySlug } from "@/lib/data";
import { getApprovedPlaceById } from "@/lib/places";

export const dynamic = "force-dynamic";

export default async function PlacePage({
  params
}: {
  params: { placeId: string };
}) {
  const place = await getApprovedPlaceById(params.placeId);
  if (!place) return notFound();

  const primaryCategory = place.categories[0];
  const category = primaryCategory ? getCategoryBySlug(primaryCategory) : null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-32">
      <div className="hud-meta flex flex-wrap items-center gap-4 text-[color:var(--text-dim)]">
        <Link className="hover:text-[color:var(--color-cyan)]" href="/">
          {"// Home"}
        </Link>
        {category && (
          <Link
            className="hover:text-[color:var(--color-cyan)]"
            href={`/c/${category.slug}`}
          >
            {`// ${category.title}`}
          </Link>
        )}
      </div>
      <PlaceDetail place={place} />
    </div>
  );
}

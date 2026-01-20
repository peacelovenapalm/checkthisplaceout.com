import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import type { Category } from "@/lib/types";

export default function CategoryTile({
  category,
  count
}: {
  category: Category;
  count: number;
}) {
  const slotIndex = String(category.order).padStart(2, "0");
  const itemCountLabel = String(count).padStart(2, "0");

  return (
    <Link
      href={`/c/${category.slug}`}
      className="group data-cartridge flex min-h-[170px] flex-col"
    >
      <div className="data-cartridge__bar">
        <span className="data-cartridge__title group-hover:text-[color:var(--accent-neon-green)] group-hover:text-glow">
          {category.title}
        </span>
        <div className="data-cartridge__meta">
          <span className="hud-meta text-[color:var(--text-dim)]">
            {copy.categoryTile.slot} {slotIndex}
          </span>
          <span className="data-cartridge__count">[{itemCountLabel}]</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-sm text-[color:var(--text-hologram)]">
          {category.caption}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="hud-label text-[color:var(--accent-electric-cyan)]">
              {copy.categoryTile.status}
            </span>
            <span className="hud-meta text-[color:var(--text-dim)]">
              {copy.categoryTile.ready}
            </span>
          </div>
          <div className="hud-border flex h-12 w-12 items-center justify-center border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)]">
            <Image
              src={category.icon}
              alt={`${category.title} icon`}
              width={24}
              height={24}
              className="h-6 w-6 opacity-80"
              unoptimized
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

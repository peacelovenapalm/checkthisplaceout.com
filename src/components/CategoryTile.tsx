import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/c/${category.slug}`}
      className="group place-card flex min-h-[160px] flex-col"
    >
      <div className="window-bar">
        <span className="window-title">{category.title}</span>
        <span className="hud-meta text-[color:var(--text-muted)]">
          // SLOT {String(category.order).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5">
        <p className="text-base text-[color:var(--text-body)]">
          {category.caption}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4">
          <span className="hud-label">Enter</span>
          <div className="flex h-12 w-12 items-center justify-center border border-[color:var(--border-color)] bg-[color:var(--bg-hud)]">
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

import Link from "next/link";
import { copy } from "@/lib/copy";

export default function PlaceNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {copy.brand.tagline}
        </p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          {copy.placeNotFound.title}
        </h1>
        <p className="text-base text-[color:var(--text-dim)]">
          {copy.placeNotFound.body}
        </p>
        <Link className="btn-primary w-fit" href="/">
          {copy.buttons.back}
        </Link>
      </header>
    </div>
  );
}

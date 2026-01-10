import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          // ERR::CONNECTION_LOST
        </p>
        <p className="hud-label">Lost signal</p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          That page does not exist.
        </h1>
        <p className="text-base text-[color:var(--text-dim)]">
          Jump back to the home list and pick a category instead.
        </p>
        <Link className="btn-primary w-fit" href="/">
          RETURN_HOME
        </Link>
      </header>
    </div>
  );
}

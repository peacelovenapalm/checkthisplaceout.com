import { copy } from "@/lib/copy";

export default function PrivacyPage() {
  const { privacy } = copy;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">{privacy.title}</p>
        <p className="hud-label">{privacy.title}</p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          {privacy.headline}
        </h1>
        <p className="text-base text-[color:var(--text-dim)]">
          {privacy.body}
        </p>
      </header>

      <section className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 text-base">
        <h2 className="display-title text-xl text-[color:var(--accent-electric-cyan)]">
          {privacy.locationTitle}
        </h2>
        <p className="text-[color:var(--text-hologram)]">
          {privacy.locationBody}
        </p>
      </section>
    </div>
  );
}

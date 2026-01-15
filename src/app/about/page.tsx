import { copy } from "@/lib/copy";

export default function AboutPage() {
  const { about } = copy;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">{copy.brand.tagline}</p>
        <p className="hud-label">{copy.nav.about}</p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          {about.header}
        </h1>
        <div className="space-y-2 text-base text-[color:var(--text-dim)]">
          {about.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>{about.footnote}</p>
        </div>
      </header>

      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-6 text-base">
        <h2 className="display-title text-xl text-[color:var(--accent-electric-cyan)]">
          {about.usageTitle}
        </h2>
        <ol className="list-decimal space-y-2 pl-6 text-[color:var(--text-hologram)]">
          {about.usageSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

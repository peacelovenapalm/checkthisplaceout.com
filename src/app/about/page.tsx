export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-meta text-[color:var(--text-dim)]">
          // SYSTEM_BRIEF
        </p>
        <p className="hud-label">About this list</p>
        <h1 className="display-title text-3xl text-[color:var(--text-hologram)] md:text-4xl">
          A friend text thread, now in a map.
        </h1>
        <p className="text-base text-[color:var(--text-dim)]">
          I built this for people who are already out and need one fast win.
          Everything here is hand-picked, no ads, no algorithms. When you tap a
          spot, you are getting the same quick note I would send a friend in
          Vegas.
        </p>
      </header>

      <section className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-6 text-base">
        <h2 className="display-title text-xl text-[color:var(--accent-electric-cyan)]">
          How to use it
        </h2>
        <ol className="list-decimal space-y-2 pl-6 text-[color:var(--text-hologram)]">
          <li>Pick a category that matches your mood.</li>
          <li>Scan the cards and tap Details for the full story.</li>
          <li>Hit INIT_ROUTE and let Maps take over.</li>
        </ol>
      </section>
    </div>
  );
}

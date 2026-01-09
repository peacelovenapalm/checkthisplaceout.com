export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="panel flex flex-col gap-3 border-2 border-[color:var(--border-color)] p-6 sm:p-8">
        <p className="hud-label">Privacy</p>
        <h1 className="display-title text-3xl text-[color:var(--text-body)] md:text-4xl">
          No accounts. No tracking obsession.
        </h1>
        <p className="text-base text-[color:var(--text-muted)]">
          This site does not require logins, collect personal profiles, or sell
          data. Basic page views may be collected by the host, but there are no
          third-party trackers baked into v1.0.
        </p>
      </header>

      <section className="panel flex flex-col gap-3 border-2 border-[color:var(--border-color)] p-6 text-base">
        <h2 className="display-title text-xl text-[color:var(--color-cyan)]">
          Location
        </h2>
        <p>
          Your location is not used in v1.0. Map pins are static, and all
          directions are links you choose to open in your own maps app.
        </p>
      </section>
    </div>
  );
}

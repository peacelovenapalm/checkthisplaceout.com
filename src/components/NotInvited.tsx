export default function NotInvited({ email }: { email?: string | null }) {
  return (
    <div className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-6 sm:p-8">
      <p className="hud-meta text-[color:var(--text-dim)]">
        {"// ACCESS_DENIED"}
      </p>
      <h1 className="display-title text-2xl text-[color:var(--text-hologram)] md:text-3xl">
        You&#39;re not on the invite list yet.
      </h1>
      <p className="max-w-2xl text-sm text-[color:var(--text-dim)]">
        {email
          ? `Signed in as ${email}. Ask an admin to activate your bartender profile.`
          : "Ask an admin to activate your bartender profile."}
      </p>
    </div>
  );
}

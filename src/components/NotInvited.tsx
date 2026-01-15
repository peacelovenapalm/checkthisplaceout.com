import { copy } from "@/lib/copy";

export default function NotInvited({ email }: { email?: string | null }) {
  return (
    <div className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-6 sm:p-8">
      <p className="hud-meta text-[color:var(--text-dim)]">
        {copy.auth.inviteOnlyTitle}
      </p>
      <h1 className="display-title text-2xl text-[color:var(--text-hologram)] md:text-3xl">
        {copy.auth.inviteOnlyTitle}
      </h1>
      <p className="max-w-2xl text-sm text-[color:var(--text-dim)]">
        {email ? `Signed in as ${email}. ${copy.auth.inviteOnlyBody}` : copy.auth.inviteOnlyBody}
      </p>
    </div>
  );
}

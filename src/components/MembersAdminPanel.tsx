"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { copy } from "@/lib/copy";
import {
  inviteMember,
  resetMemberLogin,
  type InviteMemberState,
  type ResetMemberState
} from "@/lib/actions/members";

const initialInviteState: InviteMemberState = { error: undefined };
const initialResetState: ResetMemberState = { error: undefined };

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? copy.system.loading : label}
    </button>
  );
};

export default function MembersAdminPanel() {
  const [inviteState, inviteAction] = useFormState(
    inviteMember,
    initialInviteState
  );
  const [resetState, resetAction] = useFormState(
    resetMemberLogin,
    initialResetState
  );
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(null), 1500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(link);
    } catch (error) {
      setCopied(null);
    }
  };

  return (
    <section className="panel flex flex-col gap-6 border border-[color:var(--border-color)] p-6">
      <div>
        <p className="hud-meta text-[color:var(--text-dim)]">
          {copy.members.adminPanelTitle}
        </p>
        <h2 className="display-title text-xl text-[color:var(--text-hologram)]">
          {copy.members.adminPanelTitle}
        </h2>
        <p className="text-sm text-[color:var(--text-dim)]">
          {copy.members.adminPanelHelper}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <form
          action={inviteAction}
          className="panel-muted flex flex-col gap-4 border border-[color:var(--border-color)] p-5"
        >
          <div>
            <p className="hud-meta text-[color:var(--text-dim)]">
              {copy.members.inviteTitle}
            </p>
            <p className="text-xs text-[color:var(--text-dim)]">
              {copy.members.inviteHelper}
            </p>
          </div>
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.members.emailLabel}</span>
            <input
              type="email"
              name="email"
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="bartender@bar.com"
              required
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.members.displayNameLabel}</span>
            <input
              name="display_name"
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="Neon Chris"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.members.handleLabel}</span>
            <input
              name="handle"
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="neonchris"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.members.roleLabel}</span>
            <select
              name="role"
              defaultValue="bartender"
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
            >
              <option value="bartender">{copy.members.makeBartender}</option>
              <option value="admin">{copy.members.makeAdmin}</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[color:var(--text-dim)]">
            <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4" />
            {copy.members.activeNowLabel}
          </label>
          {inviteState.error && (
            <div className="border border-[color:var(--color-red)] bg-[rgba(255,0,255,0.12)] p-3 text-xs text-[color:var(--color-red)]">
              {inviteState.error}
            </div>
          )}
          <SubmitButton label={copy.members.inviteButton} />
          {inviteState.link && (
            <div className="space-y-2 border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] p-3">
              <p className="hud-label">{copy.members.inviteLinkLabel}</p>
              <p className="text-xs text-[color:var(--text-dim)] break-all">
                {inviteState.link}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => handleCopy(inviteState.link ?? "")}
                >
                  {copy.buttons.copyLink}
                </button>
                {copied === inviteState.link && (
                  <span className="text-xs text-[color:var(--text-dim)]">
                    {copy.toast.done}
                  </span>
                )}
              </div>
            </div>
          )}
        </form>

        <form
          action={resetAction}
          className="panel-muted flex flex-col gap-4 border border-[color:var(--border-color)] p-5"
        >
          <div>
            <p className="hud-meta text-[color:var(--text-dim)]">
              {copy.members.resetTitle}
            </p>
            <p className="text-xs text-[color:var(--text-dim)]">
              {copy.members.resetHelper}
            </p>
          </div>
          <label className="space-y-2 text-sm">
            <span className="hud-label">{copy.members.emailLabel}</span>
            <input
              type="email"
              name="email"
              className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
              placeholder="bartender@bar.com"
              required
            />
          </label>
          {resetState.error && (
            <div className="border border-[color:var(--color-red)] bg-[rgba(255,0,255,0.12)] p-3 text-xs text-[color:var(--color-red)]">
              {resetState.error}
            </div>
          )}
          <SubmitButton label={copy.members.resetButton} />
          {resetState.link && (
            <div className="space-y-2 border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] p-3">
              <p className="hud-label">{copy.members.resetLinkLabel}</p>
              <p className="text-xs text-[color:var(--text-dim)] break-all">
                {resetState.link}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => handleCopy(resetState.link ?? "")}
                >
                  {copy.buttons.copyLink}
                </button>
                {copied === resetState.link && (
                  <span className="text-xs text-[color:var(--text-dim)]">
                    {copy.toast.done}
                  </span>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

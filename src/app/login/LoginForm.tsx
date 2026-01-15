"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "@/lib/actions/auth";
import { copy } from "@/lib/copy";

const initialState = { error: undefined };

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? copy.system.loading : copy.buttons.signIn}
    </button>
  );
};

export default function LoginForm() {
  const [state, formAction] = useFormState(signIn, initialState);

  return (
    <form
      action={formAction}
      className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-6"
    >
      <label className="space-y-2 text-sm">
        <span className="hud-label">Email</span>
        <input
          type="email"
          name="email"
          className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
          placeholder="you@bar.com"
        />
      </label>
      <label className="space-y-2 text-sm">
        <span className="hud-label">Password</span>
        <input
          type="password"
          name="password"
          className="w-full border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-3 py-2 text-[color:var(--text-hologram)]"
          placeholder="••••••••"
        />
      </label>
      {state.error && (
        <div className="border border-[color:var(--color-red)] bg-[rgba(255,0,60,0.1)] p-3 text-xs text-[color:var(--color-red)]">
          {state.error}
        </div>
      )}
      <SubmitButton />
    </form>
  );
}

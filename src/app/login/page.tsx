import { redirect } from "next/navigation";
import LoginForm from "@/app/login/LoginForm";
import { getSessionProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const sessionProfile = await getSessionProfile();
  if (sessionProfile.userId) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <section className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {"// INVITE_ONLY"}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          Bartender access portal
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          Sign in with your invite credentials. No public signup.
        </p>
      </section>
      <LoginForm />
    </div>
  );
}

import { updateMember } from "@/lib/actions/members";
import type { Profile } from "@/lib/types";

export default function MemberManagement({ profiles }: { profiles: Profile[] }) {
  if (!profiles.length) {
    return (
      <div className="panel-muted border border-[color:var(--border-color)] p-5">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {"// NO_MEMBERS"}
        </p>
        <p className="text-sm text-[color:var(--text-hologram)]">
          No member profiles found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {profiles.map((member) => (
        <form
          key={member.id}
          action={updateMember}
          className="panel flex flex-col gap-4 border border-[color:var(--border-color)] p-5"
        >
          <input type="hidden" name="profileId" value={member.id} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="hud-meta text-[color:var(--text-dim)]">
                {"// MEMBER"}
              </p>
              <p className="display-title text-base text-[color:var(--text-hologram)]">
                {member.display_name || "Unnamed"}
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-dim)]">
                {member.handle || member.id}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-dim)]">
                Role
                <select
                  name="role"
                  defaultValue={member.role}
                  className="ml-2 border border-[color:var(--border-color)] bg-[color:var(--bg-terminal-black)] px-2 py-1 text-[color:var(--text-hologram)]"
                >
                  <option value="admin">admin</option>
                  <option value="bartender">bartender</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[color:var(--text-dim)]">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={member.is_active}
                  className="h-4 w-4"
                />
                Active
              </label>
            </div>
          </div>
          <button type="submit" className="btn-secondary self-start">
            UPDATE
          </button>
        </form>
      ))}
    </div>
  );
}

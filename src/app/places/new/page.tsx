import PlaceForm from "@/components/PlaceForm";
import NotInvited from "@/components/NotInvited";
import { copy } from "@/lib/copy";
import { requireActiveProfile } from "@/lib/auth";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewPlacePage() {
  const sessionProfile = await requireActiveProfile();

  if (!sessionProfile.profile) {
    return <NotInvited email={sessionProfile.email} />;
  }

  const categories = getCategories();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {copy.form.newPlaceTitle}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          {copy.form.newPlaceTitle}
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          {copy.form.newPlaceHelper}
        </p>
      </section>
      <PlaceForm categories={categories} />
    </div>
  );
}

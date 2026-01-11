import { notFound } from "next/navigation";
import PlaceForm from "@/components/PlaceForm";
import NotInvited from "@/components/NotInvited";
import { requireActiveProfile } from "@/lib/auth";
import { getCategories } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPlacePage({
  params
}: {
  params: { id: string };
}) {
  const sessionProfile = await requireActiveProfile();

  if (!sessionProfile.profile) {
    return <NotInvited email={sessionProfile.email} />;
  }

  const supabase = await createSupabaseServerClient();
  const { data: place, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !place) {
    return notFound();
  }

  const typedPlace = place as PlaceRecord;
  const isOwner = typedPlace.created_by === sessionProfile.userId;
  const isAdmin = sessionProfile.profile.role === "admin";

  if (!isOwner && !isAdmin) {
    return (
      <div className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {"// ACCESS_DENIED"}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          You can&#39;t edit this submission.
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          Only the author or an admin can update a draft.
        </p>
      </div>
    );
  }

  const categories = getCategories();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="panel flex flex-col gap-3 border border-[color:var(--border-color)] p-6">
        <p className="hud-meta text-[color:var(--text-dim)]">
          {"// EDIT_DRAFT"}
        </p>
        <h1 className="display-title text-2xl text-[color:var(--text-hologram)]">
          {typedPlace.title}
        </h1>
        <p className="text-sm text-[color:var(--text-dim)]">
          Status: {typedPlace.status}
        </p>
      </section>
      <PlaceForm categories={categories} place={typedPlace} />
    </div>
  );
}

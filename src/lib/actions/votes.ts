"use server";

import { redirect } from "next/navigation";
import { getActionProfile } from "@/lib/actions/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SupabaseServerClient } from "@/lib/supabase/server";

const countVotes = async (
  supabase: SupabaseServerClient,
  placeId: string,
  vote: "yes" | "no"
) => {
  const { count, error } = await supabase
    .from("votes")
    .select("id", { count: "exact", head: true })
    .eq("place_id", placeId)
    .eq("vote", vote);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const castVote = async (formData: FormData) => {
  try {
    const placeId = String(formData.get("placeId") ?? "").trim();
    const vote = String(formData.get("vote") ?? "").trim() as "yes" | "no";

    if (!placeId || (vote !== "yes" && vote !== "no")) {
      throw new Error("Invalid vote payload.");
    }

    const { supabase, userId } = await getActionProfile();

    const { error } = await supabase.from("votes").insert({
      place_id: placeId,
      voter_id: userId,
      vote
    });

    if (error) {
      throw new Error(error.message);
    }

    const yesCount = await countVotes(supabase, placeId, "yes");
    const noCount = await countVotes(supabase, placeId, "no");

    if (yesCount >= 3 && yesCount > noCount) {
      const admin = createSupabaseAdminClient();
      const { error: approveError } = await admin
        .from("places")
        .update({
          status: "approved",
          approved_at: new Date().toISOString()
        })
        .eq("id", placeId)
        .eq("status", "submitted");

      if (approveError) {
        throw new Error(approveError.message);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vote failed.";
    redirect(`/review?error=${encodeURIComponent(message)}`);
  }

  redirect("/review");
};

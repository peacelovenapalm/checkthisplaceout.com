"use server";

import { redirect } from "next/navigation";
import { requireMember } from "@/lib/auth/requireMember";

export const castVote = async (formData: FormData): Promise<void> => {
  try {
    const placeId = String(formData.get("placeId") ?? "").trim();
    const vote = String(formData.get("vote") ?? "").trim() as "yes" | "no";

    if (!placeId || (vote !== "yes" && vote !== "no")) {
      throw new Error("Invalid vote payload.");
    }

    const { supabase } = await requireMember();
    const { data, error } = await supabase.rpc("cast_vote", {
      p_place_id: placeId,
      p_vote: vote
    });

    if (error) {
      throw new Error(error.message);
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result) {
      throw new Error("Vote failed.");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vote failed.";
    redirect(`/review?error=${encodeURIComponent(message)}`);
  }

  redirect("/review");
};

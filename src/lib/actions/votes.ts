"use server";

import { redirect } from "next/navigation";
import { requireMember } from "@/lib/auth/requireMember";

type CastVoteResult = {
  yes_count: number;
  no_count: number;
  status: string;
};

export const castVote = async (formData: FormData) => {
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

    return result as CastVoteResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vote failed.";
    redirect(`/review?error=${encodeURIComponent(message)}`);
  }

  redirect("/review");
};

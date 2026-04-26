import { canUseCredits, shouldConsumeCredits } from "@/lib/credits";

if (!canUseCredits(user)) {
  throw new Error("Sem créditos");
}

if (shouldConsumeCredits(user)) {
  await supabase
    .from("profiles")
    .update({ credits: user.credits - 1 })
    .eq("id", user.id);
}
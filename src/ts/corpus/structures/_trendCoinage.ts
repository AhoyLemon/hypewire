import type { Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

export const trendCoinage: Structure = {
  id: "trendCoinage",
  label: "The Trend Coinage",
  family: "Hype machine",
  weight: 1.5,
  requires: ["activity"],
  headline: [
    "“Vibe-{subject.activity}” Is the AI Trend Sweeping {city}",
    "What Is “Vibe-{subject.activity}”? Inside the AI Craze Taking Over {city}",
    "Everyone in {city} Is Suddenly “Vibe-{subject.activity}”",
  ],
  excerpt: excerptWith({
    lede: [
      "If you've spotted someone in {city.inline} narrating {subject.activityInline} instructions into a phone, congratulations: you've witnessed vibe-{subject.activityInline}.",
      "The rules of vibe-{subject.activityInline} are simple. You describe what you want, the AI does it wrong, and you post about it.",
    ],
  }),
};

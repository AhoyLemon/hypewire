import { w, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

// {rival} is furious, and its spokesperson's `hypocrisy` line tells on itself. It opens the excerpt because it's the funniest part and must never get cut (tests enforce this). {generation} is the one using AI and gets a harmless `quirk`. The narrator never judges anyone.
export const rageBait: Structure = {
  id: "rageBait",
  label: "Generational Rage-Bait",
  family: "Rage and takes",
  weight: 2,
  allowWrappers: false,
  headline: [
    w(
      "{Generation} {generation.Is} Using AI to Replace {subject}, and {rival} {rival.Is} Furious",
      2,
    ),
    "{Rival} Blame{rival.s} {generation} for AI-Generated {subject.bare}",
    "{Rival} Furious After {generation} Hand{generation.s} {subject} Over to AI",
    "{Generation} Let a Chatbot Handle {subject}. {Rival} Will Never Forgive {generation.Them}.",
    "Why {rival} Can't Stop Yelling About {generation} and AI",
  ],
  excerpt: excerptWith({
    lede: "{rival.hypocrisy}",
    quote: [
      "{Generation}, {generation.quirk}, went all in on AI anyway.",
      "{Generation}, {generation.quirk}, insisted they did nothing wrong.",
      "{Generation}, {generation.quirk}, responded in {generation.venue}, which {rival} could not figure out how to open.",
    ],
    background: [
      "{Generation} could not be reached for comment, but did post “{generation.catchphrase}” in {generation.venue}.",
      "Experts say the two generations have not agreed on anything since the invention of the microwave.",
    ],
    kicker: [
      "Thanksgiving is expected to be tense.",
      "Neither generation has apologized for anything, ever.",
    ],
  }),
};

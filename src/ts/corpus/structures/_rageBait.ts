import { w, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

// {generation} is using AI and gets a harmless `quirk`. {rival} is furious, and its spokesperson's `hypocrisy` line tells on itself. The narrator never judges anyone.
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
    lede: [
      "{Generation}, {generation.quirk}, {generation.has} started using AI for {subject.inline}.",
      "It started when {generation}, {generation.quirk}, asked a chatbot to handle {subject.inline}.",
      "The trouble began in {generation.venue}, where {generation}, {generation.quirk}, announced a plan to let AI handle {subject.inline}.",
    ],
    quote: [
      w("{rival.hypocrisy}", 4),
      "“I'm not mad. I'm disappointed. Also, I'm mad,” says {person}, speaking for {rival}, who did not ask.",
    ],
    background: [
      "{Generation} responded in {generation.venue}, which {rival} could not figure out how to open.",
      "Experts say the two generations have not agreed on anything since the invention of the microwave.",
    ],
    kicker: [
      "Thanksgiving is expected to be tense.",
      "{Generation} could not be reached for comment, but did post “{generation.catchphrase}” in {generation.venue}.",
      "Neither generation has apologized for anything, ever.",
    ],
  }),
};

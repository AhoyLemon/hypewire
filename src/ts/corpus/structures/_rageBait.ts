import { w, type Structure } from "../../engine/_types.js";
import { excerptWith, kickers } from "../_excerpts.js";

// {rival} is always the one who's mad at {generation}. Both carry stereotype traits from _castPools.ts.
export const rageBait: Structure = {
  id: "rageBait",
  label: "Generational Rage-Bait",
  family: "Rage and takes",
  weight: 2,
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
      "It started in {rival.venue}, as these things do.",
      "{Rival} first found out in {rival.venue} and {rival.has} not calmed down since.",
      "{Rival}, already furious about {rival.grievance}, {rival.has} found something new to be furious about.",
      "The feud began when {generation} discovered {subject.inline}, and {rival} discovered that {generation} had discovered {subject.inline}.",
    ],
    quote: [
      "“{rival.Catchphrase},” says {person}, a self-appointed spokesperson for {rival}.",
      "“{rival.Catchphrase}. Also, {subject.inline} {subject.was} better when {subject.it} {subject.was} hard,” says {person}, who speaks for {rival} whether {rival} likes it or not.",
      "“I'm not mad. I'm disappointed. Also, I'm mad,” says {person}, speaking on behalf of {rival}, who did not ask.",
    ],
    background: [
      "{Generation} fired back in {generation.venue}, calling {rival} “{rival.insult}.” {Rival} responded in {rival.venue}, calling {generation} “{generation.insult}.”",
      "Experts say the two generations have not agreed on anything since the invention of the microwave.",
    ],
    kicker: [
      "Thanksgiving is expected to be tense.",
      "{Generation} could not be reached for comment, but did post “{generation.catchphrase}” in {generation.venue}.",
      w(kickers, 1),
    ],
  }),
};

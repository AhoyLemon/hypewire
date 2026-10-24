import type { Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

export const rageBait: Structure = {
  id: "rageBait",
  label: "Generational Rage-Bait",
  family: "Rage and takes",
  weight: 2,
  headline: [
    "{Generation} {generation.Is} Using AI to Replace {subject}, and {rival} {rival.Is} Furious",
    "Why {generation} {generation.Is} Letting AI Handle {subject}, and Why {rival} Can't Stand It",
    "{Rival} Blame{rival.s} {generation} for AI-Generated {subject.bare}",
  ],
  excerpt: excerptWith([
    "It started in the comments section of a local news site and has since spread to at least four Thanksgivings.",
    "“Back in my day, we did {subject.inline} by hand,” says {person}, {person.age}, who has never once done {subject.inline} by hand.",
    "The feud began when {generation} discovered {subject.inline}, and {rival} discovered that {generation} had discovered {subject.inline}.",
  ]),
};

import { w, type Structure } from "../../engine/_types.js";
import { excerptWith, quotes } from "../_excerpts.js";

export const resurrection: Structure = {
  id: "resurrection",
  label: "The Resurrection",
  family: "Obituaries",
  weight: 3,
  headline: [
    w("{Generation} Killed {subject}. AI Could Bring {subject.Them} Back.", 3),
    "{Generation} Killed {subject}. {startup} Wants to Bring {subject.Them} Back.",
    "{Generation} Killed {subject}. Can AI Resurrect {subject.Them}?",
  ],
  excerpt: excerptWith(
    [
      "{Generation} {generation.was} accused of killing {subject.inline} sometime around 2016, along with golf, cereal, and the diamond industry.",
      "The death of {subject.inline} was ruled a homicide. The prime suspect, {generation}, never stood trial.",
      "For years, {subject.inline} lay quietly in the ground. Then {startup} showed up with a shovel and a Series A.",
    ],
    [
      w("“{subject.Inline} {subject.was} dead for a reason,” admits {expert}, {expert.title} at {startup}. “{Generation} killed {subject.them}, and I brought {subject.them} back. That's on me.”", 2),
      quotes,
    ],
  ),
};

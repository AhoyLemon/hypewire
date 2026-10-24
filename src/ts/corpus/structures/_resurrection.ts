import { seq, w, type Structure } from "../../engine/_types.js";
import { excerptWith, kickers, quotes } from "../_excerpts.js";

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
  excerpt: excerptWith({
    lede: [
      seq(
        "{Generation} {generation.was} accused of killing {subject.inline} ",
        [
          "sometime around 2016",
          "in a 2017 think piece nobody finished",
          "somewhere between avocado toast and a mortgage",
          "in broad daylight, on camera",
        ],
        ", along with ",
        [
          "golf, cereal, and the diamond industry",
          "bar soap, fabric softener, and the concept of a landline",
          "casual dining, the doorbell, and the nine-to-five",
          "beer, department stores, and eye contact",
        ],
        ".",
      ),
      seq(
        "The death of {subject.inline} was ruled a homicide. The prime suspect, {generation}, ",
        [
          "never stood trial",
          "{generation.was} too busy to stand trial",
          "posted about it",
          "{generation.has} never once apologized",
          "{generation.is} currently on a wellness retreat",
        ],
        ".",
      ),
      seq(
        "For years, {subject.inline} lay quietly in the ground. Then {startup} showed up with ",
        [
          "a shovel and a Series A",
          "a Ouija board and a pitch deck",
          "jumper cables and a SAFE note",
          "a defibrillator and somebody else's money",
          "a necromancer it found on LinkedIn",
        ],
        ".",
      ),
    ],
    quote: [
      w(
        "“{subject.Inline} {subject.was} dead for a reason,” admits {expert}, {expert.title} at {startup}. “{Generation} killed {subject.them}, and I brought {subject.them} back. That's on me.”",
        2,
      ),
      quotes,
    ],
    kicker: [
      "{Generation} did not respond to requests for comment, but did post a meme about it.",
      w(kickers, 1),
    ],
  }),
};

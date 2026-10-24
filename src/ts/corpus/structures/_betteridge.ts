import type { Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

// Betteridge's law: any headline ending in a question mark can be answered "no".
export const betteridge: Structure = {
  id: "betteridge",
  label: "The Betteridge",
  family: "Journalism tropes",
  weight: 2,
  headline: [
    "Will AI Make {subject} Obsolete?",
    "{subject.Is} {subject} Ready for the Age of AI?",
    "Can a Chatbot Love {subject} More Than You Do?",
    "Could {subject} Be the Next Industry Transformed by AI?",
  ],
  excerpt: excerptWith({
    lede: [
      "Experts are divided.",
      "Experts are divided, mostly along the lines of who owns equity in {startup}.",
      "The short answer is no. The long answer is a 14-part newsletter.",
      "We asked {percent} experts. They are divided.",
    ],
  }),
};

import { w, type Structure } from "../../engine/_types.js";
import { excerptWith, ledes } from "../_excerpts.js";

export const reframe: Structure = {
  id: "reframe",
  label: "The Reframe",
  family: "Hype machine",
  weight: 2,
  headline: [
    w("{Subject} {subject.Isnt} Dead. {subject.Its} Just AI-Native Now.", 2),
    "Stop Doing {subject.bare}. Start Orchestrating {subject.Them}.",
    "Why {subject} Need{subject.s} an AI Strategy",
    "{Subject} {subject.Is} a Platform Now",
  ],
  excerpt: excerptWith([
    "Agree? Thoughts? For too long, we've treated {subject.inline} like a hobby instead of a pipeline.",
    "I was laid off this morning, and it taught me everything I know about {subject.inline}.",
    w(ledes, 2),
  ]),
};

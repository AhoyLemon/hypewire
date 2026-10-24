import { seq, w, type Structure } from "../../engine/_types.js";
import { excerptWith, quotes } from "../_excerpts.js";

export const contrarian: Structure = {
  id: "contrarian",
  label: "The Contrarian",
  family: "Rage and takes",
  weight: 1.5,
  headline: [
    "Actually, Letting AI Ruin {subject} Is Good",
    "In Defense of AI-Generated {subject.bare}",
    "Hot Take: {Subject} Deserve{subject.s} to Be Disrupted",
    "{Subject} {subject.Was} Never That Great. Let AI Have {subject.Them}.",
  ],
  excerpt: excerptWith(
    [
      "Look, someone had to say it.",
      "I've been told this is a controversial opinion, mostly by people who enjoy {subject.inline}.",
      seq("Let's be honest: {subject.inline} peaked in ", ["1987", "the Bronze Age", "a 2009 blog post", "middle school"], "."),
    ],
    ["My editor, {expert}, asked me to soften this. I asked a chatbot to soften it instead, and it made it worse.", w(quotes, 2)],
  ),
};

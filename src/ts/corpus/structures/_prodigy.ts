import { seq, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

export const prodigy: Structure = {
  id: "prodigy",
  label: "The Prodigy",
  family: "Hype machine",
  weight: 2,
  headline: [
    "Meet the {age}-Year-Old Dropout Using AI Agents to Reinvent {subject}",
    "This {age}-Year-Old Built an AI for {subject} in a Weekend. Investors Are Feral.",
    "At {age}, {person} Wants to Put {subject} on the Blockchain. And Also AI.",
  ],
  excerpt: excerptWith(
    [
      seq(
        "{person} dropped out of ",
        ["Stanford", "community college", "a coding bootcamp", "the fourth grade", "a very prestigious summer camp"],
        " to focus on {subject.inline} full time.",
      ),
      "{person} was {age} when the idea struck: what if {subject.inline}, but with AI?",
    ],
    [
      "“{subject.Inline} {subject.is} basically just a prompt,” says {person.last}, who also describes sleep as “a legacy system.”",
      "“My parents think it's a phase,” says {person.last}, whose company is now valued at {money}.",
      "“Honestly, I've never actually tried {subject.inline},” {person.last} admits. “That's what makes me dangerous.”",
    ],
  ),
};

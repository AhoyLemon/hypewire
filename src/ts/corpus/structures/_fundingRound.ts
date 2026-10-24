import { seq, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

export const fundingRound: Structure = {
  id: "fundingRound",
  label: "The Funding Round",
  family: "Hype machine",
  weight: 2,
  headline: [
    "{startup} Raises {money} to Bring LLMs to {subject}",
    "{startup} Lands {money} Series B to Make {subject} “AI-Native”",
    "Investors Pour {money} Into {startup}, the “Uber for {subject.bare}”",
  ],
  excerpt: excerptWith(
    seq(
      "The round was led by ",
      ["Moonshot Moose Capital", "Fourteen Ventures", "the Fumbling Unicorn Fund", "a guy named Greg", "an anonymous donor with a boat"],
      ", who called {subject.inline} “the most overlooked market since air.”",
    ),
  ),
};

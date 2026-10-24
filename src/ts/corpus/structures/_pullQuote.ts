import { seq, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

export const pullQuote: Structure = {
  id: "pullQuote",
  label: "The Pull Quote",
  family: "Rage and takes",
  weight: 1.5,
  headline: seq(
    "“",
    [
      "Nobody Needs Human {subject.bare} Anymore",
      "{Subject} {subject.Was} Always a Workflow",
      "I Have Seen the Future of {subject.bare}, and It Is a Subscription",
      "We Will Not Rest Until {subject} {subject.Is} Fully Automated",
    ],
    "”: {relative} {expert} on the Future of {subject}",
  ),
  excerpt: excerptWith([
    "{expert} has a message for anyone still attached to {subject.inline}: let go.",
    "In a wide-ranging interview conducted entirely over voice memo, {expert} explained why {subject.inline} {subject.has} to change.",
    "{expert} would like you to know that {subject.inline} {subject.is} over, and that {expert.first} is available for keynotes.",
  ]),
};

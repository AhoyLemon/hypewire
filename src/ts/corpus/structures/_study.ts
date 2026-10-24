import { seq, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

export const study: Structure = {
  id: "study",
  label: "The Study",
  family: "Journalism tropes",
  weight: 2,
  headline: [
    "Study: {percent}% of {group} Now Use AI for {subject}",
    seq("New Research Finds AI Is ", ["11x", "40x", "1.02x", "Infinitely"], " Better at {subject} Than Humans"),
    "Report: {percent}% of {group} Would Let AI Handle {subject}",
  ],
  excerpt: excerptWith([
    seq(
      "The study, which surveyed ",
      ["1,200", "nine", "40,000", "several"],
      " {group.inline} and one very confused raccoon, was funded entirely by {startup}.",
    ),
    seq(
      "Researchers at ",
      ["the University of Upper Duluth", "the Mid-Atlantic Institute of Hype", "a lab above a vape shop", "Stanford's less famous cousin"],
      " reached the finding after asking a chatbot to summarize a different study.",
    ),
  ]),
};

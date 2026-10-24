import { seq, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

export const marketPanic: Structure = {
  id: "marketPanic",
  label: "The Market Panic",
  family: "Journalism tropes",
  weight: 1.5,
  headline: [
    "Investors Dump {subject} After {startup} Unveils {product}",
    "Wall Street Panics as {startup} Teases {product} for {subject}",
    "Markets Tumble on Fears AI Will Replace {subject}",
  ],
  excerpt: excerptWith([
    seq(
      "The Hype 500 fell ",
      ["900", "12", "4,000", "exactly one"],
      " points by lunch, recovered by 2 p.m., then fell again out of what analysts called “solidarity.”",
    ),
    "Traders were seen weeping openly on the floor of the exchange, though several later admitted they were just tired.",
    "{startup} says {product.inline} can do anything {subject.inline} can do, but faster, and without needing to be asked twice.",
  ]),
};

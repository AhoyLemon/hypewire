import type { Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

export const countdown: Structure = {
  id: "countdown",
  label: "The Countdown",
  family: "Obituaries",
  weight: 2,
  headline: [
    "“{relative}” Gives {subject} {timeframe}",
    "“{relative}” Says {subject} {subject.Has} {timeframe} Left",
    "“{relative}” Predicts {subject} Will Be Fully Automated in {timeframe}",
  ],
  excerpt: excerptWith([
    "{expert}, widely known as the “{relative},” says {subject.inline} {subject.has} {timeframe.inline} left, tops.",
    "The “{relative},” {expert}, made the prediction during a keynote that was also, somehow, a product launch.",
  ]),
};

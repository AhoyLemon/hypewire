import { seq, w, type Structure } from "../../engine/_types.js";
import { excerptWith, punditTails, quotes } from "../_excerpts.js";

// The headline plays it straight. The excerpt reveals the "expert" is the Estranged Uncle of AI.
export const countdown: Structure = {
  id: "countdown",
  label: "The Countdown",
  family: "Obituaries",
  weight: 2,
  headline: [
    "Top AI Expert Gives {subject} {timeframe} to Live",
    "{Subject} {subject.Has} {timeframe} Left, Warns Leading AI Expert",
    "AI Expert Predicts {subject} Will Be Extinct Within {timeframe}",
  ],
  excerpt: excerptWith({
    lede: [
      seq(
        "The expert in question is {expert}, known in some circles as the “{relative}” and in most circles as ",
        [
          "“who?”",
          "“oh no, not this one again.”",
          "“please stop emailing us.”",
          "a defendant.",
        ],
      ),
      seq(
        "The prediction comes from {expert}, the self-described “{relative},” ",
        [
          "a title nobody else uses",
          "a title currently being contested in court by the Fun Aunt of AI",
          "who also predicted the end of handshakes in 2019 and of soup in 2021",
          "whose credentials include a podcast and a very large hat",
        ],
        ".",
      ),
      seq(
        "{expert}, widely known as the “{relative},” made the prediction ",
        [
          "during a keynote that was also, somehow, a product launch",
          "in a 3 a.m. thread that ran 214 posts",
          "while being escorted from a TEDx stage",
          "to a nearly empty hotel ballroom",
        ],
        ".",
      ),
    ],
    quote: [
      w(
        seq(
          "“",
          [
            "I have seen the end of {subject.inline}, and it was beautiful",
            "I've run the numbers, and the numbers are scared",
            "{subject.Inline} {subject.has} {timeframe.inline}, tops. Less if you're reading this",
            "The models told me in a dream",
            "I'm not saying it to be dramatic. I'm saying it because I'm dramatic",
          ],
          ",” says {expert.last}, ",
          punditTails,
          ".",
        ),
        3,
      ),
      quotes,
    ],
    kicker: seq(
      "{expert.last} has also given ",
      ["soup", "the handshake", "the moon", "{generation}", "this article"],
      " ",
      ["six weeks", "until Thursday", "a stern warning", "one more chance"],
      ".",
    ),
  }),
};

import { seq, type CorpusNode, type Structure } from "../../engine/_types.js";
import { excerptWith, punditTails } from "../_excerpts.js";

// The Market Panic skips the generic pools, so the subject only shows up where a headline puts it.
const marketBackground: CorpusNode = [
  "Futures in everything else also fell, out of sympathy.",
  "Several hedge funds have reportedly pivoted to holding cash, and each other.",
  "Trading was halted twice, once for volatility and once because everyone needed a minute.",
];

export const marketPanic: Structure = {
  id: "marketPanic",
  label: "The Market Panic",
  family: "Journalism tropes",
  weight: 2,
  variants: [
    {
      id: "newerAI",
      label: "Newer AI kills week-old AI",
      headline: [
        "Markets in Freefall as {model.new} Makes Last Week's {model.old} Obsolete",
        "Investors Flee {model.old} After Learning {model.new} Exists",
        "Silicon Valley Panics as Six-Day-Old AI Model Is Declared “Legacy”",
      ],
      excerpt: excerptWith({
        lede: [
          "{model.old}, which launched on Tuesday to universal acclaim and a $2 trillion valuation, is now considered “legacy.”",
          "Just six days after {model.old} was called “the last AI model humanity will ever need,” {startup} has released {model.new}.",
          "The Hype 500 lost 900 points in four minutes after {startup} announced {model.new}, which is {model.old} with a slightly different logo.",
        ],
        quote: [
          "“I bought the old one. I bought the old one on Monday,” says {expert}, {expert.title} at {startup}, staring into the middle distance.",
          "“We are not prepared for how much better {model.new} is than {model.old},” says {expert} of {startup}, who has not used either.",
          "“Six days. We had six good days,” says {expert}, {expert.title} at {startup}.",
          "A billionaire who owns several islands has reportedly not left the bunker since the announcement.",
        ],
        background: marketBackground,
        kicker: [
          "{model.new} is expected to be obsolete by Friday.",
          "Analysts recommend holding on to {model.old} as a collectible.",
          "{startup} says {model.old} will remain fully supported until lunch.",
        ],
      }),
    },
    {
      id: "humansWin",
      label: "The non-AI thing wins",
      headline: [
        "AI Stocks Plunge as Report Suggests {subject} Work{subject.s} Fine Without AI",
        seq(
          "Tech Stocks Crater After ",
          [
            "a Pencil",
            "a Golden Retriever",
            "a Guy Named Greg",
            "an Abacus",
            "a Grandmother With a Recipe Card",
          ],
          " Outperforms Leading AI Model",
        ),
        "Investors Panic After Viral Video Shows a Human Successfully Doing Something",
      ],
      excerpt: excerptWith({
        lede: [
          "The panic began when a video surfaced of a man in {city} finishing a task with no assistance whatsoever.",
          "Analysts called the incident a “catastrophic vulnerability” in the AI economy: things that already worked.",
          "The non-AI participant finished in under a minute, on the first try, without asking a single clarifying question.",
        ],
        quote: [
          "“If things can just work on their own, what are we even doing here?” asks {expert}, {expert.title} at {startup}, visibly shaken.",
          "“This is the darkest day for innovation since the invention of the off switch,” says {expert} of {startup}.",
          "“We spent $40 billion to avoid this exact outcome,” says {expert} of {startup}, gripping a pencil.",
        ],
        background: marketBackground,
        kicker: [
          "{startup} has formed a task force to make the old way worse.",
          "The human involved has declined all interview requests and would like everyone to calm down.",
        ],
      }),
    },
    {
      id: "chronicPanic",
      label: "Panic for no reason",
      headline: [
        "Investor Panics About AI, Also About Everything",
        "“Sell Everything,” Says Analyst Who Says “Sell Everything” Every Day",
        "Markets Tumble After Analyst Has a Bad Feeling",
        "Wall Street Panics for No Clear Reason, Again",
      ],
      excerpt: excerptWith({
        lede: [
          "{expert}, who has correctly predicted 41 of the last three crashes, says the panic began “around breakfast.”",
          "Asked what specifically caused the alarm, {expert}, {expert.title} at {startup}, gestured at the sky and said “all of it.”",
          "{expert} has been in a continuous state of panic since 2008 and describes it as “a lifestyle.”",
        ],
        quote: seq(
          "“",
          [
            "I can't explain it. I just know we're doomed",
            "Something is about to happen, or already happened, or won't",
            "It's the AI. Or the moon. Something is off",
          ],
          ",” says {expert.last}, ",
          punditTails,
          ".",
        ),
        background: marketBackground,
        kicker: [
          "{expert.last} expects to panic again tomorrow, weather permitting.",
          "Markets recovered by lunch. {expert.last} did not.",
          "{expert.last}'s therapist has asked not to be named.",
        ],
      }),
    },
  ],
};

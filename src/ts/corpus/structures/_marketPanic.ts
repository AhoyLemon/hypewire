import {
  lock,
  seq,
  w,
  type CorpusNode,
  type Structure,
} from "../../engine/_types.js";
import { excerptWith, punditTails } from "../_excerpts.js";

// The Market Panic skips the generic pools, so the subject only shows up where a headline puts it.
const marketBackground: CorpusNode = [
  "Futures in everything else also fell, out of sympathy.",
  "Several hedge funds have reportedly pivoted to holding cash, and each other.",
  "Trading was halted twice, once for volatility and once because everyone needed a minute.",
];

/** Someone completely ordinary, in headline case. They follow {person}'s pronouns, so a feat can say “{person.His} Kids.” */
const someone: CorpusNode = [
  w("Someone", 2),
  lock("person", "he", "a Guy Named Greg"),
  "a Local {person.Man}",
  "a {person.Man} in {city}",
  "an Intern",
  "a Retired Dentist",
  "{person}",
];

/** Something trivial, done without a single prompt. Past tense, headline case. */
const trivialFeat: CorpusNode = [
  "Wrote an Email",
  "Remembered to Drink Water",
  "Tied a Shoe",
  "Took a Shit",
  "Parallel Parked",
  "Made Toast",
  "Looked At a Restaurant Menu",
  "Replied to a Text",
  "Did Basic Math",
  "Boiled an Egg",
  "Waited in Line",
  "Paid With Cash",
  "Talked To {person.His} Kids",
];

const humanQuotes: CorpusNode = [
  "“If things can just work on their own, what are we even doing here?” asks {expert}, {expert.title} at {startup}, visibly shaken.",
  "“This is the darkest day for innovation since the invention of the off switch,” says {expert} of {startup}.",
  "“We spent $40 billion to make sure this never happened,” says {expert} of {startup}, gripping a pencil.",
  "“They just did it. Who told them they could just do it?” asks {expert}, {expert.title} at {startup}.",
];

const humanKickers: CorpusNode = [
  "{startup} has formed a task force to make the old way worse.",
  "The human involved has declined all interview requests and would like everyone to calm down.",
  "Copycat incidents have been reported in {city.inline}.",
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
      id: "humanDidSomething",
      label: "A human did something",
      headline: [
        w(
          "Investors Panic After Viral Video Shows a Human Successfully Doing Something",
          2,
        ),
        seq(
          "AI Stocks Plunge as Footage Emerges of ",
          someone,
          " Doing Something Unassisted",
        ),
        w(
          "AI Stocks Plunge as Report Suggests {subject} Work{subject.s} Fine Without AI",
          0.5,
        ),
      ],
      excerpt: excerptWith({
        lede: [
          "The panic began when a video surfaced of a {person.man} in {city.inline} finishing a task with no assistance whatsoever.",
          "The footage, which shows a human completing a task from start to finish without a single prompt, has been viewed 40 million times.",
          "Analysts called the incident a “catastrophic vulnerability” in the AI economy: things that already worked.",
          "Witnesses say the human didn't even seem proud of it, which analysts found the most chilling part.",
        ],
        quote: humanQuotes,
        background: marketBackground,
        kicker: humanKickers,
      }),
    },
    {
      id: "humanDidTrivialThing",
      label: "A human did a trivial thing",
      headline: [
        seq(
          "Tech Stocks Crater After ",
          someone,
          " ",
          trivialFeat,
          " Without AI",
        ),
        seq("Markets Reel as ", someone, " ", trivialFeat, " Unassisted"),
        seq("AI Bubble Wobbles After ", someone, " ", trivialFeat),
        seq(
          "Investors Flee AI Stocks After ",
          someone,
          " ",
          trivialFeat,
          " Alone",
        ),
      ],
      excerpt: excerptWith({
        lede: [
          "Footage of the incident, which lasts under a minute, has been viewed 40 million times.",
          "Witnesses say the human didn't even seem proud of it, which analysts found the most chilling part.",
          "The human reportedly did not consult a chatbot, an agent, or a search engine, and it went fine.",
          "Analysts first described the feat as “basic,” then corrected themselves to “terrifyingly basic.”",
        ],
        quote: [
          "“If people find out they can just do things, we're finished,” says {expert}, {expert.title} at {startup}.",
          w(humanQuotes, 2),
        ],
        background: marketBackground,
        kicker: [
          "The human has asked for privacy, and also a sandwich, which {person.he} plan{person.s} to make {person.himself}.",
          w(humanKickers, 2),
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
        "Hedge Fund Manager Liquidates Everything After Seeing a Weird Cloud",
        "Markets Rattled After Analyst Reads a Headline, Any Headline",
        "Investor Sells Entire Portfolio Over a Dream About a Chatbot",
        "“Something's Coming,” Warns Analyst, Gesturing Vaguely",
      ],
      excerpt: excerptWith({
        lede: [
          "{expert}, who has correctly predicted 41 of the last three crashes, says the panic began “around breakfast.”",
          "Asked what specifically caused the alarm, {expert}, {expert.title} at {startup}, gestured at the sky and said “all of it.”",
          "{expert} has been in a continuous state of panic since 2008 and describes it as “a lifestyle.”",
          "The selloff began at 9:31 a.m., when {expert}, {expert.title} at {startup}, sneezed during a trading call and everyone assumed the worst.",
          "{expert} first sensed something was wrong when the office coffee machine made “a judgmental noise.”",
          "By noon, {expert} had sold every stock, then the office furniture, then a houseplant that did not technically belong to {expert.him}.",
        ],
        quote: seq(
          "“",
          [
            "I can't explain it. I just know we're doomed",
            "Something is about to happen, or already happened, or won't",
            "It's the AI. Or the moon. Something is off",
            "Nobody panics as well as I do, and I am panicking",
            "I don't need a reason. Reasons are for people who aren't already selling",
            "Buy gold. No, sell gold. Buy a boat. Sell the boat",
          ],
          ",” says {expert.last}, ",
          punditTails,
          ".",
        ),
        background: [
          "Several other analysts joined the panic, mostly to feel included.",
          w(marketBackground, 2),
        ],
        kicker: [
          "{expert.last} expects to panic again tomorrow, weather permitting.",
          "Markets recovered by lunch. {expert.last} did not.",
          "{expert.last}'s therapist has asked not to be named.",
          "{expert.last} has already scheduled tomorrow's panic for 9:30 a.m. Eastern.",
          "Asked if things would be okay, {expert.last} laughed for a long time and then hung up.",
        ],
      }),
    },
  ],
};

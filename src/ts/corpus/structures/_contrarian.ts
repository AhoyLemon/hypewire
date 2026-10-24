import { seq, w, type Structure } from "../../engine/_types.js";
import { background, excerptWith } from "../_excerpts.js";

// A first-person "change my mind" column by someone who is desperate for the internet to yell at them.
export const contrarian: Structure = {
  id: "contrarian",
  label: "The Contrarian",
  family: "Rage and takes",
  weight: 1.5,
  headline: [
    w("Change My Mind: Humans Were Never Good at {subject}", 2),
    "Actually, Letting AI Ruin {subject} Is Good",
    "In Defense of AI-Generated {subject.bare}",
    "I'm Sorry, but {subject} Deserve{subject.s} to Die",
    "Humanity Had Its Chance. It's AI's Turn.",
    "Unpopular Opinion: Your Grandmother Was Mediocre, and AI Should Replace Her",
    "Hot Take: The Human Brain Is Legacy Software",
    "Why I'm Rooting for the Robots, and You Should Too",
  ],
  excerpt: excerptWith({
    lede: [
      "Before you @ me: I've thought about this more than you have, mostly in the shower.",
      "Every time I say this at a dinner party, I stop getting invited to dinner parties. Good.",
      seq(
        "Humans have had ",
        ["200,000 years", "since the Bronze Age", "literally all of history"],
        " to get {subject.inline} right, and frankly, the results are embarrassing.",
      ),
      seq(
        "Let's be honest: {subject.inline} peaked in ",
        ["1987", "the Bronze Age", "a 2009 blog post", "middle school"],
        ", and so did most of you.",
      ),
      "Look, someone had to say it, and that someone was always going to be me.",
    ],
    quote: [
      "My editor, {expert}, asked me to soften this. I asked a chatbot to soften it instead, and it made it worse.",
      seq(
        "I have been called “",
        [
          "a ghoul",
          "a war criminal of opinions",
          "the reason people hate the internet",
          "a LinkedIn post with legs",
        ],
        "” by ",
        ["hundreds of", "dozens of", "four"],
        " people this week, which I choose to read as engagement.",
      ),
      "Empathy is just latency, and I have optimized mine to zero.",
      "Your feelings about {subject.inline} are valid, in the sense that they exist.",
    ],
    background: [
      "The human brain runs on 20 watts and still can't remember where it put the keys. I rest my case.",
      "If you disagree, that's fine. You're wrong, but it's fine.",
      w(background, 0.5),
    ],
    kicker: [
      "Change my mind. (You can't. I've blocked you.)",
      "The comments are open. I won't be reading them, but my agent will, and it agrees with me.",
      "I am available for podcasts, debates, and to be yelled at professionally.",
    ],
  }),
};

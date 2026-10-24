import { seq, w, type Structure } from "../../engine/_types.js";
import { excerptWith, kickers, ledes, quotes } from "../_excerpts.js";

// The excerpt is written as an obituary.
export const deathNotice: Structure = {
  id: "deathNotice",
  label: "The Death Notice",
  family: "Obituaries",
  weight: 3,
  headline: [
    w("AI Could Mean The End of {subject}", 3),
    "Is AI Quietly Killing {subject}?",
    "{Subject} Had a Good Run. Then Came the Chatbots.",
    "{Subject} {subject.Is} Dead, and AI Is Holding the Shovel",
    "Experts Warn AI Could Spell Doom for {subject}",
  ],
  excerpt: excerptWith({
    lede: [
      seq(
        "{subject.Inline} died ",
        ["peacefully", "suddenly", "loudly", "on a livestream", "mid-sentence"],
        " this week after a long battle with ",
        [
          "{startup}",
          "a chatbot",
          "venture capital",
          "an agentic workflow",
          "a man named Greg",
        ],
        ".",
      ),
      "{subject.Inline}, beloved by {group.inline} and tolerated by everyone else, was pronounced dead this week by {expert}, {expert.title} at {startup}.",
      seq(
        "{subject.Inline} {subject.was} ",
        [
          "taken from us too soon",
          "taken from us at exactly the right time, honestly",
          "unplugged",
        ],
        " this week, according to a press release that was also a job posting.",
      ),
      w(ledes, 1),
    ],
    quote: [
      seq(
        "{subject.It} {subject.is} survived by ",
        [
          "three Substack newsletters and a podcast that never finished season one",
          "several deeply concerned grandmothers",
          "{generation}, who {generation.is} pretending to be sad about it",
          "a cousin, the fax machine",
          "a GitHub repo nobody has touched since 2019",
        ],
        ".",
      ),
      w(quotes, 2),
    ],
    kicker: [
      seq(
        "In lieu of flowers, the family asks that you ",
        [
          "subscribe to the newsletter",
          "rate {startup} five stars",
          "stop asking the chatbot about it",
          "send GPUs",
          "like and share",
        ],
        ".",
      ),
      w(kickers, 1),
    ],
  }),
};

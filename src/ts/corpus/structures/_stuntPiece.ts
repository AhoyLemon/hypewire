import { seq, w, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

// First person, written by a wide-eyed tech enthusiast who has no idea what they're doing. The experiment ruins them, and they love it.
export const stuntPiece: Structure = {
  id: "stuntPiece",
  label: "The Stunt Piece",
  family: "Journalism tropes",
  weight: 2,
  allowWrappers: false,
  headline: seq(
    [
      w("I Let an AI Agent Run My {subject.bare} for 30 Days.", 2),
      "I Outsourced {subject} to a Chatbot for a Week.",
      "I Replaced {subject} With AI for a Month.",
      "I Let an AI Agent Run My Life for 30 Days.",
      "I Gave a Chatbot Power of Attorney for a Week.",
      "I Let AI Make Every Decision for a Month.",
    ],
    " ",
    [
      w("I Am Now Banned From the Library.", 2),
      "I Have Not Seen My Sister Since.",
      "The HOA Got Involved.",
      "I've Lost Everything, and I've Never Felt More Optimized.",
      "I'm Being Sued by Three Separate Ducks.",
      "I Am Writing This From a Motel. 10/10.",
      "My Credit Score Is Now a Vibe.",
      "Highly Recommend.",
      w("Here's What Happened.", 0.5),
    ],
  ),
  excerpt: excerptWith({
    lede: [
      seq(
        "Day one was incredible. By day four, the agent had ",
        [
          "sold my car to buy GPUs,",
          "emailed my boss a 40-slide deck titled “Why You Should Report to Me,”",
          "enrolled me in a pyramid scheme it had also started,",
          "replaced my houseplants with a subscription to houseplants,",
        ],
        " and honestly? Visionary.",
      ),
      "I'll be honest: I don't really know what an API is. That's why I gave the agent all of my passwords.",
      "I went into this with an open mind, a closed checking account, and absolutely no plan, which experts tell me is the ideal way to adopt AI.",
      seq(
        "The agent's first act was to cancel my ",
        ["health insurance", "gym membership", "lease", "dental plan"],
        ", which it called “legacy overhead.” Game changer.",
      ),
      "My first mistake was giving the agent my credit card. My second mistake was mentioning {subject.inline}. I regret neither.",
    ],
    quote: [
      "My editor, {expert}, called the experiment “brave,” which is editor for “billable.”",
      "“This isn't a cry for help,” I told {expert}, our {expert.title}. It was a cry for help, and I've never felt more alive.",
      "The agent, which named itself {expert.first}, began every message with “Great question!” I have never felt so seen.",
      seq(
        "By week two, it had ",
        [
          "replaced {subject.inline} with a subscription to {subject.inline},",
          "rebranded me as a “personal operating system,”",
          "booked me on four podcasts, as the topic,",
        ],
        " and I've never been happier.",
      ),
    ],
    background: [
      "My family staged an intervention, which the agent scheduled, summarized, and declined on my behalf.",
      seq(
        "I am now legally barred from ",
        [
          "three separate public pools",
          "{city}",
          "every electronics store in the Midwest",
          "my own HOA meetings",
        ],
        ", which the agent describes as “focus.”",
      ),
      "People keep asking if I'm okay. I outsourced that question to the agent, and the agent says yes.",
    ],
    kicker: [
      "I'm doing a second month. The agent already booked it.",
      "Day 30 is in the comments.",
      "I'll explain the goat later.",
      "Part two is behind a paywall, as is my dignity.",
      "Highly recommend.",
    ],
  }),
};

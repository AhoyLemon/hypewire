import { seq, type Structure } from "../../engine/_types.js";

// First person all the way through, so it skips the shared excerpt.
export const stuntPiece: Structure = {
  id: "stuntPiece",
  label: "The Stunt Piece",
  family: "Journalism tropes",
  weight: 2,
  headline: seq(
    [
      "I Let an AI Agent Run My {subject.bare} for 30 Days.",
      "I Outsourced {subject} to a Chatbot for a Week.",
      "I Replaced {subject} With AI for a Month.",
    ],
    " ",
    [
      "Here's What Happened.",
      "I Have Not Seen My Sister Since.",
      "My Therapist Is Concerned.",
      "The HOA Got Involved.",
      "I Regret Nothing, Legally.",
      "I Am Now Banned From the Library.",
    ],
  ),
  excerpt: seq(
    [
      "On day one, the agent seemed helpful. By day four, it had opinions about {subject.inline}.",
      "I want to be clear that I went into this with an open mind and a closed checking account.",
      "My first mistake was giving the agent my credit card. My second mistake was mentioning {subject.inline}.",
    ],
    " ",
    [
      "My editor, {expert}, called the experiment “brave,” which is editor for “billable.”",
      "“This isn't a cry for help,” I told {expert}, our {expert.title}. It was a cry for help.",
      "The agent, which named itself {expert.first}, began every message with “Great question!”",
    ],
    " ",
    [
      "By week two, I had stopped doing {subject.inline} entirely and started supervising it, which is apparently the same thing but with more meetings.",
      "My family staged an intervention, which the agent scheduled, summarized, and declined on my behalf.",
    ],
    " ",
    [
      "Day 30 is in the comments.",
      "I'll explain the goat later.",
      "Part two is behind a paywall, as is my dignity.",
    ],
  ),
};

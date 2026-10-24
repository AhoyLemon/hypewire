import {
  seq,
  w,
  type CorpusNode,
  type Structure,
} from "../../engine/_types.js";
import {
  background,
  excerptWith,
  kickers,
  punditTails,
  quotes,
} from "../_excerpts.js";

/** Who said it, in headline form. */
const speaker: CorpusNode = [
  "{relative} {expert}",
  "{expert.title} {expert}",
  "Self-Proclaimed Futurist {expert}",
  "{startup} Founder {expert}",
];

// Pointlessly provocative. The subject shows up once in the headline, never twice.
const excerpt = excerptWith({
  lede: [
    seq(
      "{expert} has a message for anyone still attached to {subject.inline}: ",
      ["grow up", "log off", "evolve", "get a subscription"],
      ".",
    ),
    "In a wide-ranging interview conducted entirely over voice memo, {expert} explained why {subject.inline} {subject.has} to go, along with several other things, including weekends.",
    "{expert} would like you to know that {subject.inline} {subject.is} over, and that {expert.first} is available for keynotes.",
    "{expert} made the remarks at a conference where {expert.first} was the only speaker, and also the only attendee.",
  ],
  quote: [
    w(
      seq(
        "“",
        [
          "Humans had a good run. Honestly, a mediocre run",
          "If you're offended, that's just your legacy software talking",
          "I'm not saying we should replace everyone. I'm saying we should replace most people",
          "Nostalgia is just a bug report from people who refuse to update",
        ],
        ",” {expert.last} added, ",
        punditTails,
        ".",
      ),
      2,
    ),
    quotes,
  ],
  background: [
    "The remarks drew immediate backlash, which {expert.last} called “the algorithm working as intended.”",
    w(background, 1),
  ],
  kicker: [
    "{expert.last} later clarified the remarks by repeating them louder.",
    "{expert.last} has since announced a podcast.",
    w(kickers, 1),
  ],
});

export const pullQuote: Structure = {
  id: "pullQuote",
  label: "The Pull Quote",
  family: "Rage and takes",
  weight: 1.5,
  allowWrappers: false,
  variants: [
    {
      id: "provocation",
      label: "Provocation, then the subject",
      weight: 2,
      headline: seq(
        "“",
        [
          "Humans Were a Beta Test",
          "Your Grandmother Was a Prompt",
          "Empathy Is a Bug, and We Have a Patch",
          "Sleep Is a Skill Issue",
          "The Only Thing Standing Between Us and Utopia Is People",
          "Every Job Is Just a Prompt Nobody Has Written Yet",
          "Honestly, the Dinosaurs Had It Coming",
          "My Kids Are Agents Now, and They're Thriving",
          "Feelings Are Just Unstructured Data",
          "I Don't Read Books. I Have Them Summarized Into Vibes",
        ],
        "”: ",
        speaker,
        " on the Future of {subject}",
      ),
      excerpt,
    },
    {
      id: "doubleDown",
      label: "The subject, then doubling down",
      headline: seq(
        "“",
        [
          "{Subject} {subject.Was} Always a Workflow",
          "We Will Not Rest Until {subject} {subject.Is} Fully Automated",
          "I Have Seen the Future of {subject.bare}, and It Is a Subscription",
          "{Subject} {subject.Was} a Mistake, and History Will Agree With Me",
          "Anyone Who Still Loves {subject} Is a Coward",
        ],
        "”: ",
        speaker,
        " ",
        [
          "Doubles Down",
          "Refuses to Apologize",
          "Has More to Say",
          "Will Not Be Taking Questions",
        ],
      ),
      excerpt,
    },
  ],
};

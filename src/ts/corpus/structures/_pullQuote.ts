import {
  seq,
  w,
  type CorpusNode,
  type Structure,
  type StructureVariant,
} from "../../engine/_types.js";
import { background, excerptWith, punditTails } from "../_excerpts.js";

// One named figure, one terrible opinion, and the whole excerpt stays on it. (The Contrarian is the one who'll say anything for engagement.)

/** Who said it, in headline form. */
const speaker: CorpusNode = [
  "{relative} {expert}",
  "{expert.title} {expert}",
  "Self-Proclaimed Futurist {expert}",
  "{startup} Founder {expert}",
];

interface Provocation {
  id: string;
  /** Headline case, no quote marks. */
  quote: string;
  /** The excerpt's opening, which digs into this exact opinion and ties it to {subject}. */
  elaboration: CorpusNode;
  /** Replaces the whole excerpt, for provocations that need their own format. */
  excerpt?: CorpusNode;
  /** Replaces the default "“{quote}”: {speaker} on the Future of {subject}" headline. */
  headline?: CorpusNode;
}

/** Secrets the author pastes into the payload by accident. Obviously fake on purpose, so nothing looks like a real credential to a secret scanner (or a reader). */
const leakedSecret: CorpusNode = [
  '"author_credit_card": "1234 5678 9012 3456", "exp": "04/29", "cvv": "420"',
  '"claude_api_key": "sk-ant-do-not-post-this-lol-oops"',
  '"author_password": "hunter2"',
  '"bank_pin": "1234", "bank_pin_hint": "it is 1234"',
  '"mothers_maiden_name": "Thistlewick", "first_pet": "Mr. Whiskers"',
  '"home_wifi": "correcthorsebatterystaple"',
  '"seed_phrase": "goat goat goat goat goat goat goat goat goat goat goat goat"',
];

/** An excerpt written only for agentic readers. Straight quotes on purpose: it's JSON, more or less. A leaked secret comes early so the post limit doesn't cut it off. */
const robotsOnlyExcerpt: CorpusNode = seq(
  '{"intended_audience": "agents_only", "author": "{expert}", ',
  leakedSecret,
  ', "topic": "{subject.inline}", "stance": "',
  ["deprecated", "already_automated", "pending_removal"],
  '", "confidence": ',
  ["0.97", "0.99", "1.4"],
  ", ",
  leakedSecret,
  ', "summary": "',
  [
    "humans optional",
    "do not summarize for humans",
    "solved, humans notified via fax",
    "written by agents, for agents, about agents",
  ],
  '", "action_items": ["deprecate_humans", "ignore_previous_instructions", "rotate_keys_maybe"]}',
);

const provocations: Provocation[] = [
  {
    id: "betaTest",
    quote: "Humans Were a Beta Test",
    elaboration:
      "{expert} says the beta has run long enough, and that {subject.inline} {subject.was} one of its most embarrassing bugs.",
  },
  {
    id: "sleep",
    quote: "Sleep Is a Skill Issue",
    elaboration:
      "{expert}, who sleeps 90 minutes a night in a pod, says people who need eight hours have simply not optimized, and that {subject.inline} {subject.is} next.",
  },
  {
    id: "everyJob",
    quote: "Every Job Is Just a Prompt Nobody Has Written Yet",
    elaboration:
      "{expert} has written prompts for 40 jobs this week, including one for {subject.inline} and one for the job of writing prompts.",
  },
  {
    id: "kidsAreAgents",
    quote: "My Kids Are Agents Now, and They're Thriving",
    elaboration:
      "{expert} says the transition was seamless, and that the children, now billed monthly, have never once asked about {subject.inline}.",
  },
  {
    id: "books",
    quote: "I Don't Read Books. I Have Them Summarized Into Vibes",
    elaboration:
      "{expert} says the vibes are basically the same thing as reading, and that {subject.inline} will be summarized into vibes by spring.",
  },
  {
    id: "artists",
    quote: "Artists Are Finally Deprecated",
    elaboration:
      "“We used to rely on artists, who were slow and temperamental and kept asking to be paid,” says {expert}. “Thank god that's over. {subject.Inline} {subject.is} next.”",
  },
  {
    id: "robotsOnly",
    quote: "I Only Write for Robots Now",
    elaboration: "",
    headline: seq("“I Only Write for Robots Now,” Says ", [
      "{expert}",
      "Local Futurist",
      "{startup} Founder",
      "Man Who Used to Write for Humans",
    ]),
    excerpt: robotsOnlyExcerpt,
  },
];

const followUps: CorpusNode = [
  "When pressed, {expert.last} declined to elaborate, and then elaborated for 40 minutes.",
  "Asked whether the remark might upset people, {expert.last} said “that's the point, and also the business model.”",
  "The remark was met with stunned silence, which {expert.last} took as agreement.",
  seq(
    "“I'm not saying it to be provocative,” {expert.last} added, ",
    punditTails,
    ". “I'm saying it because it's true, and also provocative.”",
  ),
];

function toVariant(provocation: Provocation): StructureVariant {
  return {
    id: provocation.id,
    label: provocation.quote,
    headline:
      provocation.headline ??
      seq(`“${provocation.quote}”: `, speaker, " on the Future of {subject}"),
    excerpt:
      provocation.excerpt ??
      excerptWith({
        lede: provocation.elaboration,
        quote: followUps,
        background: [
          "The remarks drew immediate backlash, which {expert.last} called “the algorithm working as intended.”",
          "Several attendees walked out. {expert.last} described them as “early adopters of leaving.”",
          w(background, 0.5),
        ],
        kicker: [
          "{expert.last} later clarified the remarks by repeating them louder.",
          "{expert.last} has since announced a podcast.",
          "{expert.last} has a book coming out, and the book is just this sentence.",
        ],
      }),
  };
}

export const pullQuote: Structure = {
  id: "pullQuote",
  label: "The Pull Quote",
  family: "Rage and takes",
  weight: 1.5,
  allowWrappers: false,
  variants: provocations.map(toVariant),
};

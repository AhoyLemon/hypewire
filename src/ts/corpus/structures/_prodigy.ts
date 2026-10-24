import { seq, w, type Structure } from "../../engine/_types.js";
import { excerptWith, kickers } from "../_excerpts.js";

export const prodigy: Structure = {
  id: "prodigy",
  label: "The Prodigy",
  family: "Hype machine",
  weight: 2,
  headline: [
    seq(
      "Meet the {age}-Year-Old ",
      [
        "Dropout",
        "Prodigy",
        "Founder",
        "Visionary Who Can't Legally Rent a Car",
      ],
      " Using AI Agents to Reinvent {subject}",
    ),
    seq(
      "This {age}-Year-Old Built an AI for {subject} ",
      [
        "in a Weekend",
        "During Study Hall",
        "on a School Chromebook",
        "While Grounded",
        "Instead of Taking the SAT",
      ],
      ". ",
      [
        "Investors Are Feral.",
        "Investors Are Weeping.",
        "Investors Have Been Asked to Calm Down.",
        "Investors Are Being Sedated.",
        "Three VCs Have Already Proposed.",
      ],
    ),
    seq("At {age}, {person} Wants to Put {subject} on the Blockchain. ", [
      "And Also AI.",
      "And the Moon.",
      "And Also in Your Walls.",
      "Their Mom Is Very Proud.",
      "Nobody Has Asked Why.",
    ]),
  ],
  excerpt: excerptWith({
    lede: [
      seq(
        "{person} dropped out of ",
        [
          "Stanford",
          "community college",
          "a coding bootcamp",
          "the fourth grade",
          "a very prestigious summer camp",
          "driver's ed",
        ],
        " to focus on {subject.inline} full time.",
      ),
      seq(
        "{person} was {age} when the idea struck: what if {subject.inline}, but ",
        [
          "with AI",
          "with AI and a subscription",
          "agentic",
          "on the blockchain, and also AI",
        ],
        "?",
      ),
      seq(
        "{person} doesn't have a driver's license yet, but already has ",
        [
          "a chief of staff",
          "a personal brand",
          "a 14-point plan for {subject.inline}",
          "two cofounders and a lawyer",
        ],
        ".",
      ),
    ],
    quote: [
      "“{subject.Inline} {subject.is} basically just a prompt,” says {person.last}, who also describes sleep as “a legacy system.”",
      "“My parents think it's a phase,” says {person.last}, whose company is now valued at {money}.",
      "“Honestly, I've never actually tried {subject.inline},” {person.last} admits. “That's what makes me dangerous.”",
      seq(
        "“I'm not here to disrupt {subject.inline},” says {person.last}. “I'm here to ",
        [
          "make {subject.them} agentic",
          "ship",
          "be on a podcast about {subject.them}",
          "turn 25, eventually",
        ],
        ".”",
      ),
      "{person.last}'s pitch deck is a single slide that says “{subject.inline}, but AI” in Comic Sans. It raised {money}.",
    ],
    kicker: [
      "{person.last} will be speaking at three conferences this year, chaperone permitting.",
      "{person.last}'s parents have asked that reporters stop calling the house.",
      w(kickers, 1),
    ],
  }),
};

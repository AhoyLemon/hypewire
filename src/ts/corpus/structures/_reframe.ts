import { seq, w, type Structure } from "../../engine/_types.js";
import { background, excerptWith, kickers, quotes } from "../_excerpts.js";

// LinkedIn thought leadership. The headline reframes, the excerpt escalates.
export const reframe: Structure = {
  id: "reframe",
  label: "The Reframe",
  family: "Hype machine",
  weight: 2,
  headline: [
    w("{Subject} {subject.Isnt} Dead. {subject.Its} Just AI-Native Now.", 2),
    w("{Subject} {subject.Is} a Platform Now", 2),
    "What {subject} Taught Me About B2B Sales",
    "{Subject} {subject.Is} Just a Workflow You Haven't Automated Yet",
    "Your {subject.bare} Strategy Is Already Obsolete",
  ],
  excerpt: excerptWith({
    lede: [
      "Agree? Thoughts? For too long, we've treated {subject.inline} like a hobby instead of a pipeline.",
      "I was laid off this morning, and it taught me everything I know about {subject.inline}.",
      seq(
        "My ",
        ["daughter", "barista", "rideshare driver", "therapist", "dentist"],
        " asked me what {subject.inline} {subject.is}. I told them: ",
        [
          "a funnel",
          "a go-to-market motion",
          "a data layer",
          "an API nobody has monetized yet",
        ],
        ".",
      ),
      seq(
        "Unpopular opinion: {subject.inline} {subject.isnt} a tradition. {subject.Its} ",
        [
          "a funnel",
          "a go-to-market motion",
          "a data layer",
          "an API nobody has monetized yet",
        ],
        ".",
      ),
    ],
    quote: [
      w(
        "“If you're not using AI for {subject.inline} by Q3, you're already dead,” warns {expert}, {expert.title} at {startup}.",
        2,
      ),
      seq(
        "“I wept at a red light thinking about {subject.inline},” writes {expert}, {expert.title} at {startup}. “",
        [
          "Then I wrote a framework",
          "Then I raised a seed round",
          "Then I got a ticket, because the light was green",
        ],
        ".”",
      ),
      "“{subject.Inline} {subject.is} a sales call, if you're brave enough,” writes {expert}, {expert.title} at {startup}, in a post with 40,000 likes.",
      "“Stop doing {subject.inline}. Start orchestrating {subject.them},” writes {expert}, {expert.title} at {startup}, from a hammock.",
      quotes,
    ],
    background: [
      "Here's what nobody is telling you: {subject.inline} {subject.was} never about {subject.inline}. {subject.It} {subject.was} about leadership.",
      w(background, 1),
    ],
    kicker: [
      "♻️ Repost if {subject.inline} changed your life.",
      "Comments are open. DMs are open. The mind, sadly, is not.",
      seq(
        "{expert.last} is humbled to announce ",
        [
          "a new role",
          "a keynote nobody requested",
          "a book about {subject.inline}, written by an intern",
        ],
        ".",
      ),
      w(kickers, 1),
    ],
  }),
};

import { seq, type CorpusNode, type Structure } from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

// The Study skips the generic pools, so the subject only shows up where a headline puts it.
const studyBackground: CorpusNode = [
  "The findings have already been cited in three keynotes, two of them by the authors.",
  "Critics noted the study's charts have no axes. The authors noted the critics have no vision.",
  "A follow-up study is planned, pending funding, a hypothesis, and a second researcher.",
];

const studyKickers: CorpusNode = [
  "The study has not been peer reviewed, or reviewed.",
  "The paper will appear in a journal the authors founded last week.",
  "Funding for the study was provided by {startup}, which sells the cure.",
  "The authors are already working on a sequel.",
];

/** Things that are secretly AI, according to science. Title case, plural. */
const suspects: CorpusNode = [
  "Ducks",
  "Your Coworkers",
  "Golden Retrievers on the Internet",
  "Wedding DJs",
  "Weather Forecasters",
  "Podcast Hosts",
  "Pigeons",
  "Clouds",
  "LinkedIn Influencers",
  "Mall Santas",
];

export const study: Structure = {
  id: "study",
  label: "The Study",
  family: "Journalism tropes",
  weight: 2,
  variants: [
    {
      id: "population",
      label: "Bold claim, tiny sample",
      headline: [
        "Study: {percent}% of {group} Now Use AI for {subject}",
        "Report: {percent}% of {group} Would Let AI Raise Their Children",
        "{percent}% of {group} Trust AI More Than Their Own Families, Study Finds",
        "Study Finds {percent}% of {group} Have Already Been Replaced by AI and Didn't Notice",
      ],
      excerpt: excerptWith({
        lede: [
          seq(
            "The finding is based on a survey of ",
            ["two", "three", "four"],
            " {group.inline}, which the authors describe as “plenty.”",
          ),
          seq(
            "Researchers reached the figure after asking three {group.inline} at a ",
            ["gas station", "bowling alley", "funeral", "Renaissance faire"],
            " and rounding up.",
          ),
          "The study's methodology section is a single sentence, and the sentence is “trust us.”",
        ],
        quote: [
          "“We didn't need a control group. We had confidence,” says lead author {expert}, {expert.title} at {startup}.",
          "“Peer review is just gatekeeping with extra steps,” says lead author {expert} of {startup}.",
          "“Our sample size was small, but it was very passionate,” says lead author {expert}, {expert.title} at {startup}.",
          "“The numbers don't lie. We didn't check, but they don't,” says lead author {expert} of {startup}.",
        ],
        background: studyBackground,
        kicker: studyKickers,
      }),
    },
    {
      id: "benchmark",
      label: "Bold benchmark, unfair test",
      headline: [
        seq(
          "AI Is ",
          ["11x", "40x", "1,000x", "Infinitely"],
          " Better at {subject} Than Humans, New Benchmark Finds",
        ),
        seq(
          "New Benchmark Shows AI Is Now ",
          ["11x", "40x", "300%"],
          " More Efficient at {subject} Than Humans",
        ),
        "AI Beats Humans at {subject} in Landmark Head-to-Head Test",
      ],
      excerpt: excerptWith({
        lede: [
          "The benchmark measured how quickly a chatbot and a human could type the word “{subject.bareInline}.” The human was not told the test had started.",
          "The AI was timed against a human volunteer who, researchers later confirmed, was asleep at the time.",
          seq(
            "The human participant was asked to compete ",
            [
              "with one hand",
              "underwater",
              "while being heckled",
              "from the parking lot",
            ],
            ". The AI was asked nothing, and won anyway.",
          ),
          "Efficiency was measured in vibes per second, a unit the researchers invented that morning.",
        ],
        quote: [
          "“The results speak for themselves, which is good, because we can't explain them,” says lead researcher {expert} of {startup}.",
          "“Was the test fair? Define fair,” says lead researcher {expert}, {expert.title} at {startup}.",
          "“Humans had every advantage, except being a computer,” says lead researcher {expert}, {expert.title} at {startup}.",
        ],
        background: studyBackground,
        kicker: studyKickers,
      }),
    },
    {
      id: "secretlyAI",
      label: "Surprising fact, no evidence",
      headline: [
        seq("Study: {percent}% of ", suspects, " Are Actually AI"),
        seq(
          "Researchers Confirm ",
          ["Most", "Nearly All", "At Least Half of All"],
          " ",
          suspects,
          " Are AI",
        ),
        seq(
          "{percent}% of ",
          suspects,
          " Have Been AI This Whole Time, Report Finds",
        ),
      ],
      excerpt: excerptWith({
        lede: [
          "The researchers declined to explain how they know this, saying only that “you can just tell.”",
          "The finding is based on a single photo that the lead author describes as “too symmetrical.”",
          "Asked for evidence, the research team pointed at the sky and nodded slowly.",
          "The study does not include data, sources, or a second page.",
        ],
        quote: [
          "“Once you see it, you can't unsee it,” says lead author {expert}, {expert.title} at {startup}, who has not slept in four days.",
          "“I'm not saying it's all AI. I'm saying it's mostly AI,” says {expert} of {startup}, while blinking an unusual amount.",
          "“Ask yourself when you last saw a pigeon blink,” says {expert} of {startup}, who has stopped blinking as a precaution.",
        ],
        background: studyBackground,
        kicker: studyKickers,
      }),
    },
  ],
};

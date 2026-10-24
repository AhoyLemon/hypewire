import {
  seq,
  w,
  type CorpusNode,
  type Structure,
} from "../../engine/_types.js";
import { excerptWith } from "../_excerpts.js";

// The Study skips the generic pools, so the subject only shows up where a headline puts it. The narrator is on the researchers' side: the data is garbage, and the article helps hand-wave it.
const studyBackground: CorpusNode = [
  "The findings have already been cited in three keynotes, two of them by the authors.",
  "Critics noted the study's charts have no axes. The authors noted the critics have no vision.",
  "A follow-up study is planned, pending funding, a hypothesis, and a second researcher.",
  "The underlying data has since been lost, which the authors say only makes the finding more impressive.",
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
  "Squirrels",
  "Your Neighbors",
  "Customer Service Reps",
  "Sports Commentators",
  "Houseplants",
  "Seagulls",
  "Your Child's Imaginary Friends",
];

export const study: Structure = {
  id: "study",
  label: "The Study",
  family: "Journalism tropes",
  weight: 2,
  variants: [
    {
      id: "population",
      label: "Bold claim, garbage data",
      headline: [
        w("Study: {percent}% of {group} Now Use AI for {subject}", 2),
        "Report: {percent}% of {group} Would Let AI Raise Their Children",
        "{percent}% of {group} Trust AI More Than Their Own Families, Study Finds",
        "Study Finds {percent}% of {group} Have Already Been Replaced by AI and Didn't Notice",
      ],
      excerpt: excerptWith({
        lede: [
          seq(
            "The figure comes from ",
            [
              "a survey of the lead author's group chat",
              "a poll in the comments of the lead author's own post",
              "a spreadsheet the lead author found on a bus",
              "data the lead author swears is basically real",
              "a single, very convincing conversation at a barbecue",
            ],
            ", which the authors call “more than enough.”",
          ),
          "The number has already been cited by three senators, two keynotes, and one very excited uncle, and the authors see no reason to check it now.",
          "Critics have raised questions about the methodology, which the authors answered by making the chart bigger.",
          "The researchers arrived at the figure the old-fashioned way: they picked one that felt right.",
        ],
        quote: [
          w(
            seq(
              "“The numbers don't lie. ",
              [
                "We didn't check, but they don't",
                "We lie, with numbers",
                "Lying isn't a thing that exists anymore",
                "Numbers aren't people. AI is people",
              ],
              ",” says lead author {expert}, {expert.title} at {startup}.",
            ),
            2,
          ),
          "“Our sample size was small, but it was very passionate,” says lead author {expert}, {expert.title} at {startup}.",
          "“Methodology is just a vibe with footnotes,” says lead author {expert} of {startup}.",
          "“Is it accurate? It's accurate enough to be a headline,” says lead author {expert}, {expert.title} at {startup}.",
          "“Some people say we need more data. Those people are not in our data,” says lead author {expert} of {startup}.",
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
          seq(
            "To keep things fair, the human was asked to compete ",
            [
              "with one hand",
              "underwater",
              "while being heckled",
              "from the parking lot",
              "blindfolded",
            ],
            ". The AI was asked nothing, and won anyway.",
          ),
          "In the interest of rigor, the human was not told the test had started, what the test was, or that they were in it.",
          "Researchers controlled for human error by removing the humans.",
          "The AI was given a three-week head start, which the authors call standard practice in the field they invented.",
          "Efficiency was measured in vibes per second, a unit the researchers invented that morning to make sure the numbers came out right.",
          "The benchmark measured how quickly a chatbot and a human could type the word “{subject.bareInline}.” For fairness, the human used a rotary phone.",
          "In a rigorous double-blind setup, the human was blindfolded and the AI was not.",
        ],
        quote: [
          "“Was the test fair? Define fair,” says lead researcher {expert}, {expert.title} at {startup}.",
          "“Humans had every advantage, except being a computer,” says lead researcher {expert}, {expert.title} at {startup}.",
          "“The results speak for themselves, which is good, because we can't explain them,” says lead researcher {expert} of {startup}.",
          "“We graded on a curve, and the curve was us,” says lead researcher {expert} of {startup}.",
          "“The human had every opportunity to be a computer and chose not to,” says lead researcher {expert}, {expert.title} at {startup}.",
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
        seq(
          "Scientists Warn That ",
          suspects,
          " May Be AI, and May Know We Know",
        ),
      ],
      excerpt: excerptWith({
        lede: [
          "The researchers declined to explain how they know this, saying only that “you can just tell.”",
          "The finding is based on a single photo that the lead author describes as “too symmetrical.”",
          "Asked for evidence, the research team pointed at the sky and nodded slowly.",
          "The study does not include data, sources, or a second page.",
          "The team's evidence consists of a gut feeling, a blurry video, and a strong vibe from the lead author's uncle.",
          "Researchers say the giveaway is “the way they look at you,” which they declined to describe further.",
          "The report cites no sources, but it does include a drawing.",
        ],
        quote: [
          "“Once you see it, you can't unsee it,” says lead author {expert}, {expert.title} at {startup}, who has not slept in four days.",
          "“I'm not saying it's all AI. I'm saying it's mostly AI,” says {expert} of {startup}, while blinking an unusual amount.",
          "“Ask yourself when you last saw a pigeon blink,” says {expert} of {startup}, who has stopped blinking as a precaution.",
          "“We're not conspiracy theorists. We're conspiracy practitioners,” says lead author {expert}, {expert.title} at {startup}.",
          "“How else do you explain the hands?” asks {expert} of {startup}, holding up a photo nobody else can see.",
        ],
        background: studyBackground,
        kicker: studyKickers,
      }),
    },
  ],
};

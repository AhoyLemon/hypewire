import { seq, w, type CorpusNode } from "../engine/_types.js";

// Generic pools. Each structure can bring its own lede, quote, background, or kicker, and anything it leaves out falls back to these.
// The excerpt is cut to fit the post, so the jokes go up front. The lede and quote get read, and the background and kicker mostly exist to get cut off mid-sentence.

/** Increasingly unwell ways to describe an announcement. */
const reactions: CorpusNode = [
  "honestly kind of a lot",
  "a war crime, but for vibes",
  "the Manhattan Project for {subject.inline}",
  "bigger than fire",
  "biblical",
  "the most important invention since the wheel, or at least since the Segway",
  "a cry for help with a valuation",
  "unhinged, in a good way, probably",
];

export const ledes: CorpusNode = [
  seq(
    "For nearly ",
    ["4,000", "600", "nine", "a solid 90"],
    " years, humans have relied on {subject.inline}. ",
    [
      "A startup in {city.inline} thinks that was the problem.",
      "That ends Tuesday.",
      "{startup} would like a word.",
      "Investors are calling that “a missed opportunity.”",
    ],
  ),
  seq(
    "It started, as these things do, with ",
    [
      "a pitch deck and a vibe",
      "a tweet that should have stayed a draft",
      "a whiteboard, a dream, and a medically concerning amount of cold brew",
      "a founder who had just finished a podcast about stoicism",
      "a guy named Greg",
    ],
    ".",
  ),
  seq(
    "When {person}, {person.age}, first asked a chatbot for help with {subject.inline}, ",
    [
      "nobody expected tears",
      "the chatbot asked for equity",
      "the chatbot proposed marriage",
      "the chatbot replied with a 40-page manifesto and a merch store",
    ],
    ".",
  ),
  seq("Nobody asked for an AI-powered version of {subject.inline}. ", [
    "It's coming anyway.",
    "It shipped last night.",
    "It has already raised a Series B.",
    "It is already in beta, and it is already sorry.",
  ]),
  seq(
    "In a move experts are calling “inevitable” and “",
    reactions,
    ",” {startup} has turned its attention to {subject.inline}.",
  ),
  seq(
    "{subject.Inline} {subject.has} survived ",
    [
      "wars, recessions, and the invention of the microwave",
      "two world wars, disco, and the Atkins diet",
      "the fall of Rome and the rise of LinkedIn",
      "plague, famine, and at least one Florida man",
    ],
    ". {subject.It} may not survive {startup}.",
  ),
  seq(
    "There was a time when {subject.inline} {subject.was} sacred. That time ended ",
    [
      "last Tuesday.",
      "around 2:40 this morning.",
      "during a very long video call.",
      "the moment someone said “platform.”",
    ],
  ),
  seq(
    "Silicon Valley has a new obsession, and for once it isn't ",
    ["sleep", "living forever", "cold plunges", "raw milk", "a guy's jawline"],
    ". It's {subject.inline}.",
  ),
  seq(
    "Venture capitalists have spent the last ",
    ["six months", "fiscal quarter", "long weekend"],
    " quietly buying up ",
    [
      "every domain name with “{subject.bareInline}” in it",
      "anyone who has ever posted about {subject.inline}",
      "the last remaining experts on {subject.inline}, mostly for parts",
    ],
    ", and now we know why.",
  ),
  "Somewhere in {city.inline}, a dropout who just turned {age} is building the future of {subject.inline}. Nobody can stop them.",
];

/** What a pundit says, before the attribution. No closing punctuation, because the attribution adds it. */
export const punditLines: CorpusNode = [
  "This is bigger than fire",
  "I haven't slept since the demo",
  "Future generations won't even know what {subject.inline} {subject.was}, and honestly, good",
  "I have seen the future of {subject.inline}, and it has a waitlist",
  "Anyone still doing {subject.inline} by hand should be studied",
  "If you're not using AI for {subject.inline} by Q3, you're already dead",
  "We're not replacing {subject.inline}. We're making {subject.them} inevitable",
  "Think of it as {subject.inline}, but with a subscription",
  "The future of {subject.inline} is agentic, and so am I",
  "My therapist told me to stop talking about {subject.inline}. My therapist has since been automated",
  "I wept at a red light thinking about {subject.inline}. Then I wrote a framework",
  "Honestly, {subject.inline} had a good run",
];

/** How a pundit's sentence ends, after "says {expert}," */
export const punditTails: CorpusNode = [
  "from a standing desk on a treadmill",
  "while live-streaming a cold plunge",
  "before asking, twice, to be called “a visionary” in print",
  "shortly before being escorted off the stage",
  "between sips of a $19 mushroom coffee",
  "in a voice memo that ran 46 minutes",
  "while wearing a vest over a slightly smaller vest",
  "from inside a sensory deprivation tank",
  "before bursting into tears, unprompted",
  "to a room that had already emptied",
  "while being gently restrained by a publicist",
  "before refusing to elaborate, or blink",
];

export const quotes: CorpusNode = [
  w(
    seq(
      "“",
      punditLines,
      ",” says {expert}, {expert.title} at {startup}, ",
      punditTails,
      ".",
    ),
    4,
  ),
  seq(
    "“",
    punditLines,
    ",” ",
    ["warns", "insists", "screams", "whispers"],
    " {expert} of {startup}, ",
    punditTails,
    ".",
  ),
  "“People said the same thing about the printing press,” says {expert}, {expert.title} at {startup}, who has not read about the printing press.",
  "“We asked the model how it feels about {subject.inline},” says {expert} of {startup}. “It wrote a 4,000-word apology.”",
  "“The future of {subject.inline} is agentic,” says {expert}, {expert.title} at {startup}, before declining to define “agentic.”",
  "“Our model has thought about {subject.inline} more than any human alive,” says {expert} of {startup}, who has not checked.",
  "“My grandmother would have loved this,” says {expert}, {expert.title} at {startup}, whose grandmother has asked to be left out of it.",
];

// Newsy filler, long enough that the cut almost always lands in here.
export const background: CorpusNode = [
  "The news comes amid growing concern that AI may soon be better at {subject.inline} than the people who invented {subject.them}, many of whom were unavailable for comment.",
  seq(
    "It is the latest in a series of announcements that analysts describe as “a lot,” “too much,” and “",
    [
      "honestly, can everyone just take a breath",
      "please, I have a family",
      "something we need to talk about as a society, ideally not on a podcast",
    ],
    ".”",
  ),
  "Industry watchers say the shift could affect millions of jobs, several hobbies, and at least one family reunion.",
  "Critics argue the technology is not ready. Supporters argue that has never stopped anyone before.",
  "The move follows a record year for AI investment, most of which went to companies that had previously done something else entirely.",
];

export const kickers: CorpusNode = [
  "Whether {subject.inline} survive{subject.s} remains, experts say, “a whole thing.”",
  "Representatives for {subject.inline} did not respond to requests for comment.",
  "{startup} plans to raise another round by Friday.",
  "A waitlist is available now. It is already full.",
  "At press time, {subject.inline} could not be reached for comment.",
  "This story has been updated to include more hype.",
  "{startup} is now valued at {money}, a figure it describes as “conservative.”",
  "Analysts expect the trend to continue until it doesn't.",
];

export interface ExcerptParts {
  lede?: CorpusNode;
  quote?: CorpusNode;
  background?: CorpusNode;
  kicker?: CorpusNode;
}

/** Lede, quote, background, kicker. Any part a structure leaves out uses the generic pool. Mix the generic pool into a structure's own with `w(ledes, 1)` and friends. */
export function excerptWith(parts: ExcerptParts = {}): CorpusNode {
  return seq(
    parts.lede ?? ledes,
    " ",
    parts.quote ?? quotes,
    " ",
    parts.background ?? background,
    " ",
    parts.kicker ?? kickers,
  );
}

export const sharedExcerpt: CorpusNode = excerptWith();

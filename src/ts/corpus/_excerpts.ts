import { seq, w, type CorpusNode } from "../engine/_types.js";

// The excerpt is cut to fit the post, so the jokes go up front. By the time the background or kicker shows up, it's probably getting cut off mid-sentence, which is the point.

export const ledes: CorpusNode = [
  seq(
    "For nearly ",
    ["4,000", "600", "nine", "a solid 90"],
    " years, humans have relied on {subject.inline}. A startup in {city} thinks that was the problem.",
  ),
  "It started, as these things do, with a pitch deck and a vibe.",
  "When {person}, {person.age}, first asked a chatbot for help with {subject.inline}, nobody expected tears.",
  "Nobody asked for an AI-powered version of {subject.inline}. It's coming anyway.",
  "In a move experts are calling “inevitable” and “honestly kind of a lot,” {startup} has turned its attention to {subject.inline}.",
  "{subject.Inline} {subject.has} survived wars, recessions, and the invention of the microwave. {subject.It} may not survive {startup}.",
  seq(
    "There was a time when {subject.inline} {subject.was} sacred. That time ended ",
    ["last Tuesday", "around 2:40 this morning", "during a very long video call", "the moment someone said “platform”"],
    ".",
  ),
  "Silicon Valley has a new obsession, and for once it isn't sleep. It's {subject.inline}.",
  seq(
    "Venture capitalists have spent the last ",
    ["six months", "fiscal quarter", "long weekend"],
    " quietly buying up {subject.inline}, and now we know why.",
  ),
  "Somewhere in {city}, a dropout who just turned {age} is building the future of {subject.inline}. Nobody can stop them.",
];

export const quotes: CorpusNode = [
  w("“We're not replacing {subject.inline},” says {expert}, {expert.title} at {startup}. “We're making {subject.them} inevitable.”", 2),
  "“Honestly, {subject.inline} had a good run,” says {expert}, {expert.title} at {startup}, from a standing desk on a treadmill.",
  "“People said the same thing about the printing press,” says {expert}, {expert.title} at {startup}, who has not read about the printing press.",
  "“Think of it as {subject.inline}, but with a subscription,” says {expert} of {startup}.",
  "“If you're not using AI for {subject.inline} by Q3, you're already dead,” warns {expert}, {expert.title} at {startup}.",
  "“We asked the model how it feels about {subject.inline},” says {expert} of {startup}. “It wrote a 4,000-word apology.”",
  "{expert}, {expert.title} at {startup}, puts it plainly: “{subject.Inline} {subject.is} a workflow now.”",
  "“The future of {subject.inline} is agentic,” says {expert}, {expert.title} at {startup}, before declining to define “agentic.”",
  "“Our model has thought about {subject.inline} more than any human alive,” says {expert} of {startup}, who has not checked.",
  "“My grandmother would have loved this,” says {expert}, {expert.title} at {startup}, whose grandmother has asked to be left out of it.",
];

// Newsy filler, written to be long enough that the cut almost always lands in here.
export const background: CorpusNode = [
  "The news comes amid growing concern that AI may soon be better at {subject.inline} than the people who invented {subject.them}, many of whom were unavailable for comment.",
  "It is the latest in a series of announcements that analysts describe as “a lot,” “too much,” and “honestly, can everyone just take a breath.”",
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

/** Lede, quote, background, kicker. Structures pass their own lede (and optionally quote) pools. */
export function excerptWith(lede: CorpusNode, quote: CorpusNode = quotes): CorpusNode {
  return seq(lede, " ", quote, " ", background, " ", kickers);
}

export const sharedExcerpt: CorpusNode = excerptWith(ledes);

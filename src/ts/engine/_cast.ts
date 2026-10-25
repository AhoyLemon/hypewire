import { pickWeighted, randomInt, type Rng } from "./_rng.js";
import { fillTokens, resolveNode } from "./_resolve.js";
import type {
  CastPools,
  Corpus,
  GenderedWord,
  Generation,
  Phrase,
  PronounMap,
  Pronouns,
  Structure,
  Subject,
  TokenMap,
  Wrapper,
} from "./_types.js";

/** A subject after defaults (and any wrapper) are applied. */
export interface ResolvedSubject {
  name: string;
  bare: string;
  inline: string;
  plural: boolean;
  activity?: string;
  wrapperId: string | null;
}

export interface Person {
  first: string;
  last: string;
  /** From the first name. */
  pronouns: Pronouns;
}

/** A generation with its stereotype traits picked down to strings. */
export interface ResolvedGeneration {
  name: string;
  plural: boolean;
  age: number;
  /** This generation's own spokesperson, name plus age: "Juniper Turnblatt, 29". */
  speaker: string;
  speakerPronouns: Pronouns;
  traits: Record<string, string>;
}

export interface Cast {
  subject: ResolvedSubject;
  generation: ResolvedGeneration;
  rival: ResolvedGeneration;
  /** "Mindloaf" plus a new/old version pair, for "Mindloaf 5" vs "Mindloaf 4.9". */
  model: { name: string; new: string; old: string };
  expert: Person & { title: string };
  person: Person & { age: number };
  relative: string;
  startup: string;
  city: Phrase;
  money: string;
  age: number;
  percent: number;
  timeframe: Phrase;
  group: Phrase;
  product: Phrase;
  /** Carried along so castTokens can build {expert.man} and friends. */
  genderedWords: GenderedWord[];
}

export interface CastOverrides {
  subjectName?: string;
  /** undefined = roll for it, null = never wrap, string = that wrapper's id. */
  wrapperId?: string | null;
}

const byWeight = (item: { weight?: number }): number => item.weight ?? 1;

const stripArticle = (text: string): string => text.replace(/^the /i, "");

function inlineOf(item: { name: string; inline?: string }): string {
  return item.inline ?? item.name.toLowerCase();
}

export function subjectFits(subject: Subject, structure: Structure): boolean {
  return (structure.requires ?? []).every(
    (field) => subject[field] !== undefined,
  );
}

export function canWrap(structure: Structure): boolean {
  return (
    structure.allowWrappers !== false &&
    !(structure.requires ?? []).includes("activity")
  );
}

export function wrapperFits(
  wrapper: Wrapper,
  subject: ResolvedSubject,
): boolean {
  return wrapper.allowPlural !== false || !subject.plural;
}

export function resolveSubject(subject: Subject): ResolvedSubject {
  return {
    name: subject.name,
    bare: subject.bare ?? stripArticle(subject.name),
    inline: inlineOf(subject),
    plural: subject.plural ?? false,
    activity: subject.activity,
    wrapperId: null,
  };
}

/** "the Casserole" + "Big {bare}" -> "Big Casserole". Wrapped subjects are singular and lose their activity. */
export function applyWrapper(
  subject: ResolvedSubject,
  wrapper: Wrapper,
): ResolvedSubject {
  const parts = {
    bare: subject.bare,
    bareInline: stripArticle(subject.inline),
  };
  const name = fillTokens(wrapper.name, parts);
  return {
    name,
    bare: stripArticle(name),
    inline: fillTokens(wrapper.inline, parts),
    plural: false,
    wrapperId: wrapper.id,
  };
}

function pickSubject(
  corpus: Corpus,
  structure: Structure,
  rng: Rng,
  overrides: CastOverrides,
): ResolvedSubject {
  let subject: Subject;
  if (overrides.subjectName !== undefined) {
    const found = corpus.subjects.find((s) => s.name === overrides.subjectName);
    if (!found) throw new Error(`Unknown subject "${overrides.subjectName}"`);
    if (!subjectFits(found, structure))
      throw new Error(
        `Subject "${found.name}" doesn't fit structure "${structure.id}"`,
      );
    subject = found;
  } else {
    subject = pickWeighted(
      corpus.subjects.filter((s) => subjectFits(s, structure)),
      byWeight,
      rng,
    );
  }

  const resolved = resolveSubject(subject);
  if (!canWrap(structure) || overrides.wrapperId === null) return resolved;

  if (overrides.wrapperId !== undefined) {
    const wrapper = corpus.wrappers.find((wr) => wr.id === overrides.wrapperId);
    if (!wrapper) throw new Error(`Unknown wrapper "${overrides.wrapperId}"`);
    if (!wrapperFits(wrapper, resolved))
      throw new Error(
        `Wrapper "${wrapper.id}" doesn't fit plural subject "${resolved.name}"`,
      );
    return applyWrapper(resolved, wrapper);
  }

  const fitting = corpus.wrappers.filter((wr) => wrapperFits(wr, resolved));
  if (rng() >= corpus.wrapperChance || fitting.length === 0) return resolved;
  return applyWrapper(resolved, pickWeighted(fitting, byWeight, rng));
}

/** Name plus age, mostly in newswire style. */
export const SPEAKER_FORMATS: Array<{
  weight: number;
  format: (name: string, age: number) => string;
}> = [
  { weight: 3, format: (name, age) => `${name}, ${age}` },
  { weight: 1, format: (name, age) => `${age}-year-old ${name}` },
  { weight: 1, format: (name, age) => `${name} (${age})` },
];

function pickName(pools: CastPools, rng: Rng): Person {
  const first = pickWeighted(pools.firstNames, byWeight, rng);
  return {
    first: first.name,
    last: resolveNode(pools.lastNames, rng),
    pronouns: first.pronouns,
  };
}

/** Picks the generation's traits, age, and its own spokesperson, so a speaker's age never contradicts another character's. {speaker} and its pronouns inside a trait are filled here. */
function resolveGeneration(
  generation: Generation,
  pools: CastPools,
  rng: Rng,
): ResolvedGeneration {
  const age = randomInt(generation.ages[0], generation.ages[1], rng);
  const { first, last, pronouns } = pickName(pools, rng);
  const { format } = pickWeighted(SPEAKER_FORMATS, byWeight, rng);
  const speaker = format(`${first} ${last}`, age);
  const tokens = {
    speaker,
    ...pronounTokens("speaker", pronouns, pools.genderedWords),
  };
  const traits = Object.fromEntries(
    Object.entries(generation.traits).map(([key, node]) => [
      key,
      fillTokens(resolveNode(node, rng, { speaker: pronouns }), tokens),
    ]),
  );
  return {
    name: generation.name,
    plural: generation.plural,
    age,
    speaker,
    speakerPronouns: pronouns,
    traits,
  };
}

/** Picks every shared detail once, so the headline and excerpt agree. */
export function pickCast(
  corpus: Corpus,
  structure: Structure,
  rng: Rng,
  overrides: CastOverrides = {},
): Cast {
  const { cast } = corpus;
  const subject = pickSubject(corpus, structure, rng, overrides);
  const generation = pickWeighted(cast.generations, byWeight, rng);
  const rival = pickWeighted(
    cast.generations.filter((g) => g.name !== generation.name),
    byWeight,
    rng,
  );
  const modelName = resolveNode(cast.models, rng);
  const versions = pickWeighted(cast.modelVersions, byWeight, rng);
  const person = { ...pickName(cast, rng), age: randomInt(34, 88, rng) };
  const expert = {
    ...pickName(cast, rng),
    title: resolveNode(cast.titles, rng),
  };

  return {
    subject,
    generation: resolveGeneration(generation, cast, rng),
    rival: resolveGeneration(rival, cast, rng),
    model: { name: modelName, new: versions.new, old: versions.old },
    expert,
    person,
    // The relative is the expert's epithet, so "Godfather of AI" can lock to "he".
    relative: resolveNode(cast.relatives, rng, { expert: expert.pronouns }),
    startup: resolveNode(cast.startups, rng),
    city: pickWeighted(cast.cities, byWeight, rng),
    money: resolveNode(cast.money, rng),
    age: randomInt(15, 23, rng),
    percent: randomInt(51, 97, rng),
    timeframe: pickWeighted(cast.timeframes, byWeight, rng),
    group: pickWeighted(cast.groups, byWeight, rng),
    product: pickWeighted(cast.products, byWeight, rng),
    genderedWords: cast.genderedWords,
  };
}

const SINGULAR = {
  is: "is",
  isnt: "isn't",
  was: "was",
  has: "has",
  it: "it",
  its: "it's",
  them: "it",
  s: "s",
};
const PLURAL = {
  is: "are",
  isnt: "aren't",
  was: "were",
  has: "have",
  it: "they",
  its: "they're",
  them: "them",
  s: "",
};

const PRONOUNS: Record<Pronouns, Record<string, string>> = {
  he: { he: "he", him: "him", his: "his", himself: "himself", hes: "he's" },
  she: { he: "she", him: "her", his: "her", himself: "herself", hes: "she's" },
  they: {
    he: "they",
    him: "them",
    his: "their",
    himself: "themself",
    hes: "they're",
  },
};

const PERSON_VERBS = ["is", "isnt", "was", "has", "s"] as const;

const GENDERED_INDEX: Record<Pronouns, number> = { he: 0, she: 1, they: 2 };

/** A cast member's pronouns, verbs that agree with them, and gendered words, each keyed by its "he" form: {expert.his} is "his", "her" or "their", and {expert.man} is "man", "woman" or "person". Singular "they" takes plural verbs. */
export function pronounTokens(
  prefix: string,
  pronouns: Pronouns,
  words: readonly GenderedWord[],
): TokenMap {
  const verbs = pronouns === "they" ? PLURAL : SINGULAR;
  const entries = [
    ...Object.entries(PRONOUNS[pronouns]),
    ...PERSON_VERBS.map((key) => [key, verbs[key]]),
    ...words.map((word) => [word[0], word[GENDERED_INDEX[pronouns]]]),
  ];
  return Object.fromEntries(
    entries.map(([key, value]) => [`${prefix}.${key}`, value]),
  );
}

/** Who a lock() can name in a headline or excerpt. The keys match the token prefixes. */
export function castPronouns(cast: Cast): PronounMap {
  return {
    expert: cast.expert.pronouns,
    person: cast.person.pronouns,
    "generation.speaker": cast.generation.speakerPronouns,
    "rival.speaker": cast.rival.speakerPronouns,
  };
}

function grammarTokens(prefix: string, plural: boolean): TokenMap {
  const forms = plural ? PLURAL : SINGULAR;
  return Object.fromEntries(
    Object.entries(forms).map(([key, value]) => [`${prefix}.${key}`, value]),
  );
}

function phraseTokens(prefix: string, phrase: Phrase): TokenMap {
  return { [prefix]: phrase.name, [`${prefix}.inline`]: inlineOf(phrase) };
}

function generationTokens(
  prefix: string,
  generation: ResolvedGeneration,
  words: readonly GenderedWord[],
): TokenMap {
  const traits = Object.entries(generation.traits).map(([key, value]) => [
    `${prefix}.${key}`,
    value,
  ]);
  // Verbs agree with the name ("Gen Z Is"), but a generation is still people, so pronouns stay "they".
  return {
    [prefix]: generation.name,
    ...grammarTokens(prefix, generation.plural),
    [`${prefix}.it`]: PLURAL.it,
    [`${prefix}.its`]: PLURAL.its,
    [`${prefix}.them`]: PLURAL.them,
    [`${prefix}.age`]: String(generation.age),
    [`${prefix}.speaker`]: generation.speaker,
    ...pronounTokens(`${prefix}.speaker`, generation.speakerPronouns, words),
    ...Object.fromEntries(traits),
  };
}

/** Flattens a cast into the {token} names the corpus uses. */
export function castTokens(cast: Cast): TokenMap {
  const { subject, expert, person, genderedWords } = cast;
  const tokens: TokenMap = {
    subject: subject.name,
    "subject.bare": subject.bare,
    "subject.inline": subject.inline,
    "subject.bareInline": stripArticle(subject.inline),
    ...grammarTokens("subject", subject.plural),
    ...generationTokens("generation", cast.generation, genderedWords),
    ...generationTokens("rival", cast.rival, genderedWords),
    model: cast.model.name,
    "model.new": `${cast.model.name} ${cast.model.new}`,
    "model.old": `${cast.model.name} ${cast.model.old}`,
    expert: `${expert.first} ${expert.last}`,
    "expert.first": expert.first,
    "expert.last": expert.last,
    "expert.title": expert.title,
    ...pronounTokens("expert", expert.pronouns, genderedWords),
    person: `${person.first} ${person.last}`,
    "person.first": person.first,
    "person.last": person.last,
    "person.age": String(person.age),
    ...pronounTokens("person", person.pronouns, genderedWords),
    relative: cast.relative,
    startup: cast.startup,
    // Unlike other phrases, a place keeps its capitals mid-sentence ("Duluth"), so inline only differs when the corpus says so.
    city: cast.city.name,
    "city.inline": cast.city.inline ?? cast.city.name,
    money: cast.money,
    age: String(cast.age),
    percent: String(cast.percent),
    ...phraseTokens("timeframe", cast.timeframe),
    ...phraseTokens("group", cast.group),
    ...phraseTokens("product", cast.product),
  };

  if (subject.activity !== undefined) {
    tokens["subject.activity"] = subject.activity;
    tokens["subject.activityInline"] = subject.activity.toLowerCase();
  }

  return tokens;
}

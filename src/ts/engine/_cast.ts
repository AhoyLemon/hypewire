import { pickWeighted, randomInt, type Rng } from "./_rng.js";
import { fillTokens, resolveNode } from "./_resolve.js";
import type { Corpus, Generation, Phrase, Structure, Subject, TokenMap, Wrapper } from "./_types.js";

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
}

export interface Cast {
  subject: ResolvedSubject;
  generation: Generation;
  rival: Generation;
  expert: Person & { title: string };
  person: Person & { age: number };
  relative: string;
  startup: string;
  city: string;
  money: string;
  age: number;
  percent: number;
  timeframe: Phrase;
  group: Phrase;
  product: Phrase;
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
  return (structure.requires ?? []).every((field) => subject[field] !== undefined);
}

export function canWrap(structure: Structure): boolean {
  return structure.allowWrappers !== false && !(structure.requires ?? []).includes("activity");
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
export function applyWrapper(subject: ResolvedSubject, wrapper: Wrapper): ResolvedSubject {
  const parts = { bare: subject.bare, bareInline: stripArticle(subject.inline) };
  const name = fillTokens(wrapper.name, parts);
  return {
    name,
    bare: stripArticle(name),
    inline: fillTokens(wrapper.inline, parts),
    plural: false,
    wrapperId: wrapper.id,
  };
}

function pickSubject(corpus: Corpus, structure: Structure, rng: Rng, overrides: CastOverrides): ResolvedSubject {
  let subject: Subject;
  if (overrides.subjectName !== undefined) {
    const found = corpus.subjects.find((s) => s.name === overrides.subjectName);
    if (!found) throw new Error(`Unknown subject "${overrides.subjectName}"`);
    if (!subjectFits(found, structure)) throw new Error(`Subject "${found.name}" doesn't fit structure "${structure.id}"`);
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
    return applyWrapper(resolved, wrapper);
  }

  if (rng() >= corpus.wrapperChance) return resolved;
  return applyWrapper(resolved, pickWeighted(corpus.wrappers, byWeight, rng));
}

/** Picks every shared detail once, so the headline and excerpt agree. */
export function pickCast(corpus: Corpus, structure: Structure, rng: Rng, overrides: CastOverrides = {}): Cast {
  const { cast } = corpus;
  const subject = pickSubject(corpus, structure, rng, overrides);
  const generation = pickWeighted(cast.generations, byWeight, rng);
  const rival = pickWeighted(
    cast.generations.filter((g) => g.name !== generation.name),
    byWeight,
    rng,
  );

  return {
    subject,
    generation,
    rival,
    expert: {
      first: resolveNode(cast.firstNames, rng),
      last: resolveNode(cast.lastNames, rng),
      title: resolveNode(cast.titles, rng),
    },
    person: {
      first: resolveNode(cast.firstNames, rng),
      last: resolveNode(cast.lastNames, rng),
      age: randomInt(34, 88, rng),
    },
    relative: resolveNode(cast.relatives, rng),
    startup: resolveNode(cast.startups, rng),
    city: resolveNode(cast.cities, rng),
    money: resolveNode(cast.money, rng),
    age: randomInt(15, 23, rng),
    percent: randomInt(51, 97, rng),
    timeframe: pickWeighted(cast.timeframes, byWeight, rng),
    group: pickWeighted(cast.groups, byWeight, rng),
    product: pickWeighted(cast.products, byWeight, rng),
  };
}

const SINGULAR = { is: "is", isnt: "isn't", was: "was", has: "has", it: "it", its: "it's", them: "it", s: "s" };
const PLURAL = { is: "are", isnt: "aren't", was: "were", has: "have", it: "they", its: "they're", them: "them", s: "" };

function grammarTokens(prefix: string, plural: boolean): TokenMap {
  const forms = plural ? PLURAL : SINGULAR;
  return Object.fromEntries(Object.entries(forms).map(([key, value]) => [`${prefix}.${key}`, value]));
}

function phraseTokens(prefix: string, phrase: Phrase): TokenMap {
  return { [prefix]: phrase.name, [`${prefix}.inline`]: inlineOf(phrase) };
}

/** Flattens a cast into the {token} names the corpus uses. */
export function castTokens(cast: Cast): TokenMap {
  const { subject, expert, person } = cast;
  const tokens: TokenMap = {
    subject: subject.name,
    "subject.bare": subject.bare,
    "subject.inline": subject.inline,
    ...grammarTokens("subject", subject.plural),
    generation: cast.generation.name,
    ...grammarTokens("generation", cast.generation.plural),
    rival: cast.rival.name,
    ...grammarTokens("rival", cast.rival.plural),
    expert: `${expert.first} ${expert.last}`,
    "expert.first": expert.first,
    "expert.last": expert.last,
    "expert.title": expert.title,
    person: `${person.first} ${person.last}`,
    "person.first": person.first,
    "person.last": person.last,
    "person.age": String(person.age),
    relative: cast.relative,
    startup: cast.startup,
    city: cast.city,
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

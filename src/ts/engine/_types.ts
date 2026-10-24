/** An option with a non-default weight. Unweighted options count as 1. */
export interface Weighted {
  readonly weight: number;
  readonly node: CorpusNode;
}

/** Parts that are resolved in order and joined into one string. */
export interface Sequence {
  readonly seq: readonly CorpusNode[];
}

/**
 * The corpus is written with three shapes:
 *   string      -> literal text (may contain {tokens})
 *   array       -> pick ONE option, by weight
 *   seq(...)    -> resolve every part, in order, and join them
 */
export type CorpusNode = string | Weighted | Sequence | readonly CorpusNode[];

/** Marks an option as more (or less) likely than its siblings. */
export function w(node: CorpusNode, weight: number): Weighted {
  return { node, weight };
}

/** Joins its parts in order. */
export function seq(...nodes: CorpusNode[]): Sequence {
  return { seq: nodes };
}

/** A pool entry with a headline form and an optional mid-sentence form. */
export interface Phrase {
  name: string;
  /** Defaults to `name` lowercased; override for proper nouns. */
  inline?: string;
  weight?: number;
}

/** The thing AI is about to end. Grammar fields keep "It/Them" and "Is/Are" honest. */
export interface Subject {
  /** Headline form: "the Casserole", "Napkins". */
  name: string;
  /** No leading article, for wrappers and "AI-Generated {subject.bare}". Defaults to `name` minus a leading "the ". */
  bare?: string;
  /** Mid-sentence form for excerpts. Defaults to `name` lowercased; override for proper nouns. */
  inline?: string;
  plural?: boolean;
  /** Reads after "Vibe-": "Whittling", "Ice Fishing". */
  activity?: string;
  weight?: number;
}

/** Subject fields a structure can insist on. */
export type SubjectRequirement = "activity";

/** Rarely-applied dressing that turns "the Casserole" into "Big Casserole". */
export interface Wrapper {
  id: string;
  /** Templates using {bare} and {bareInline}. */
  name: string;
  inline: string;
  /** Defaults to true. Set false when the wrapper reads wrong after a plural ("Bowling Leagues Culture"). */
  allowPlural?: boolean;
  weight?: number;
}

export interface Generation {
  name: string;
  plural: boolean;
  weight?: number;
  /** Inclusive age range, for {speaker} inside traits and {generation.age}. */
  ages: [number, number];
  /** Stereotypes, used as {generation.<key>} and {rival.<key>}. Every generation needs the same keys. Don't reuse grammar names (is, was, has, it, its, them, s). */
  traits: Record<string, CorpusNode>;
}

/** A fake AI model release: "Mindloaf 5" making last week's "Mindloaf 4.9" obsolete. */
export interface ModelVersions {
  new: string;
  old: string;
  weight?: number;
}

export type Family =
  "Obituaries" | "Hype machine" | "Journalism tropes" | "Rage and takes";

export interface Structure {
  id: string;
  label: string;
  family: Family;
  weight?: number;
  requires?: SubjectRequirement[];
  /** Defaults to true. Structures that require an activity never get wrappers. */
  allowWrappers?: boolean;
  /** Required unless the structure has variants. */
  headline?: CorpusNode;
  /** Falls back to the corpus' shared excerpt. */
  excerpt?: CorpusNode;
  /** For a structure with several jokes, where each headline has to pair with its own excerpt. Replaces `headline` and `excerpt`. */
  variants?: StructureVariant[];
}

export interface StructureVariant {
  id: string;
  label: string;
  weight?: number;
  headline: CorpusNode;
  excerpt?: CorpusNode;
}

/** Everything picked once per article so the headline and excerpt agree. */
export interface CastPools {
  firstNames: CorpusNode;
  lastNames: CorpusNode;
  titles: CorpusNode;
  relatives: CorpusNode;
  startups: CorpusNode;
  cities: CorpusNode;
  money: CorpusNode;
  generations: Generation[];
  timeframes: Phrase[];
  groups: Phrase[];
  products: Phrase[];
  models: CorpusNode;
  modelVersions: ModelVersions[];
}

export interface Corpus {
  structures: Structure[];
  subjects: Subject[];
  wrappers: Wrapper[];
  /** Chance (0–1) that a wrappable subject gets wrapped. */
  wrapperChance: number;
  cast: CastPools;
  sharedExcerpt: CorpusNode;
}

/** Token name -> value, e.g. "subject.is" -> "are". */
export type TokenMap = Record<string, string>;

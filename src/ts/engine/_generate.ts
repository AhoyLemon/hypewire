import { graphemeLength } from "../lib/graphemes.js";
import { castTokens, pickCast } from "./_cast.js";
import { fillTokens, resolveNode } from "./_resolve.js";
import { pickWeighted, randomSeed, seededRng, type Rng } from "./_rng.js";
import { fitPost } from "./_truncate.js";
import type { Corpus, Family, Structure } from "./_types.js";

export interface GenerateOptions {
  /** Same seed, same post. Ignored when `rng` is passed. */
  seed?: number;
  rng?: Rng;
  structureId?: string;
  subjectName?: string;
  /** undefined = roll for it, null = never wrap, string = that wrapper's id. */
  wrapperId?: string | null;
}

export interface PostDebug {
  seed: number | null;
  structureId: string;
  structureLabel: string;
  family: Family;
  subject: string;
  wrapperId: string | null;
  /** The excerpt before it was cut to fit. */
  fullExcerpt: string;
  graphemes: number;
}

export interface GeneratedPost {
  text: string;
  headline: string;
  excerpt: string;
  debug: PostDebug;
}

function findStructure(corpus: Corpus, id: string): Structure {
  const structure = corpus.structures.find((s) => s.id === id);
  if (!structure) throw new Error(`Unknown structure "${id}"`);
  return structure;
}

/** Picks a structure, picks a cast, resolves the headline and excerpt, and cuts the excerpt to fit. */
export function generate(corpus: Corpus, options: GenerateOptions = {}): GeneratedPost {
  const seed = options.rng ? null : (options.seed ?? randomSeed());
  const rng = options.rng ?? seededRng(seed ?? 0);

  const structure = options.structureId
    ? findStructure(corpus, options.structureId)
    : pickWeighted(corpus.structures, (s) => s.weight ?? 1, rng);

  const cast = pickCast(corpus, structure, rng, {
    subjectName: options.subjectName,
    wrapperId: options.wrapperId,
  });
  const tokens = castTokens(cast);

  const headline = fillTokens(resolveNode(structure.headline, rng), tokens).trim();
  const fullExcerpt = fillTokens(resolveNode(structure.excerpt ?? corpus.sharedExcerpt, rng), tokens).trim();
  const { text, excerpt } = fitPost(headline, fullExcerpt);

  return {
    text,
    headline,
    excerpt,
    debug: {
      seed,
      structureId: structure.id,
      structureLabel: structure.label,
      family: structure.family,
      subject: cast.subject.name,
      wrapperId: cast.subject.wrapperId,
      fullExcerpt,
      graphemes: graphemeLength(text),
    },
  };
}

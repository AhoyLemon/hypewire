import { graphemeLength } from "../lib/graphemes.js";
import { castPronouns, castTokens, pickCast } from "./_cast.js";
import { fillTokens, resolveNode } from "./_resolve.js";
import { pickWeighted, randomSeed, seededRng, type Rng } from "./_rng.js";
import { fitExcerpt } from "./_truncate.js";
import type { Corpus, Family, Structure, StructureVariant } from "./_types.js";

export interface GenerateOptions {
  /** Same seed, same post. Ignored when `rng` is passed. */
  seed?: number;
  rng?: Rng;
  structureId?: string;
  /** Only meaningful alongside `structureId`. */
  variantId?: string;
  subjectName?: string;
  /** undefined = roll for it, null = never wrap, string = that wrapper's id. */
  wrapperId?: string | null;
}

export interface PostDebug {
  seed: number | null;
  structureId: string;
  structureLabel: string;
  /** null for structures without variants. */
  variantId: string | null;
  variantLabel: string | null;
  family: Family;
  subject: string;
  wrapperId: string | null;
  /** The excerpt before it was cut to fit. */
  fullExcerpt: string;
  /** The length of the post text. */
  graphemes: number;
}

export interface GeneratedPost {
  /** Never cut. It goes in the image. */
  headline: string;
  /** The post text: the excerpt cut to fit, ending in an ellipsis. */
  excerpt: string;
  debug: PostDebug;
}

const byWeight = (item: { weight?: number }): number => item.weight ?? 1;

function findStructure(corpus: Corpus, id: string): Structure {
  const structure = corpus.structures.find((s) => s.id === id);
  if (!structure) throw new Error(`Unknown structure "${id}"`);
  return structure;
}

/** A variant, or a plain structure's own headline and excerpt with an id of null. */
export type PickedVariant = Omit<StructureVariant, "id"> & {
  id: string | null;
};

/** A structure's variants, or its own headline and excerpt as a single variant with an id of null. */
export function variantsOf(structure: Structure): PickedVariant[] {
  if (structure.variants?.length) return structure.variants;
  if (!structure.headline)
    throw new Error(`Structure "${structure.id}" has no headline or variants`);
  return [
    {
      id: null,
      label: structure.label,
      headline: structure.headline,
      excerpt: structure.excerpt,
    },
  ];
}

function pickVariant(
  structure: Structure,
  variantId: string | undefined,
  rng: Rng,
): PickedVariant {
  const variants = variantsOf(structure);
  if (variantId === undefined) return pickWeighted(variants, byWeight, rng);

  const found = variants.find((v) => v.id === variantId);
  if (!found)
    throw new Error(`Unknown variant "${variantId}" of "${structure.id}"`);
  return found;
}

/** Picks a structure (and variant), picks a cast, resolves the headline and excerpt, and cuts the excerpt to fit the post. */
export function generate(
  corpus: Corpus,
  options: GenerateOptions = {},
): GeneratedPost {
  const seed = options.rng ? null : (options.seed ?? randomSeed());
  const rng = options.rng ?? seededRng(seed ?? 0);

  const structure = options.structureId
    ? findStructure(corpus, options.structureId)
    : pickWeighted(corpus.structures, byWeight, rng);
  const variant = pickVariant(structure, options.variantId, rng);

  const cast = pickCast(corpus, structure, rng, {
    subjectName: options.subjectName,
    wrapperId: options.wrapperId,
  });
  const tokens = castTokens(cast);
  const pronouns = castPronouns(cast);

  const headline = fillTokens(
    resolveNode(variant.headline, rng, pronouns),
    tokens,
  ).trim();
  const fullExcerpt = fillTokens(
    resolveNode(variant.excerpt ?? corpus.sharedExcerpt, rng, pronouns),
    tokens,
  ).trim();
  const excerpt = fitExcerpt(fullExcerpt);

  return {
    headline,
    excerpt,
    debug: {
      seed,
      structureId: structure.id,
      structureLabel: structure.label,
      variantId: variant.id,
      variantLabel: variant.id === null ? null : variant.label,
      family: structure.family,
      subject: cast.subject.name,
      wrapperId: cast.subject.wrapperId,
      fullExcerpt,
      graphemes: graphemeLength(excerpt),
    },
  };
}

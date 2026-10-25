import { pickWeighted, type Rng } from "./_rng.js";
import type {
  CorpusNode,
  Locked,
  PronounMap,
  Sequence,
  TokenMap,
  Weighted,
} from "./_types.js";

function isSequence(node: CorpusNode): node is Sequence {
  return typeof node === "object" && "seq" in node;
}

function isWeighted(node: CorpusNode): node is Weighted {
  return typeof node === "object" && "weight" in node && "node" in node;
}

export function isLocked(node: CorpusNode): node is Locked {
  return typeof node === "object" && "pronouns" in node && "node" in node;
}

/** Looks through lock() to a w() inside it, so either order works. */
function weightOf(node: CorpusNode): number {
  if (isWeighted(node)) return node.weight;
  if (isLocked(node)) return weightOf(node.node);
  return 1;
}

function lockFits(lock: Locked, pronouns: PronounMap): boolean {
  const actual = pronouns[lock.who];
  if (actual === undefined)
    throw new Error(`lock() names "${lock.who}", who isn't in the cast here`);
  return actual === lock.pronouns;
}

/** Whether an option's locks (through any w() or nested lock()) all match the cast. */
function optionFits(node: CorpusNode, pronouns: PronounMap): boolean {
  if (isWeighted(node)) return optionFits(node.node, pronouns);
  if (isLocked(node))
    return lockFits(node, pronouns) && optionFits(node.node, pronouns);
  return true;
}

/** Walks a corpus node: strings are literal, arrays pick one by weight, sequences join in order. Options locked to other pronouns are skipped. */
export function resolveNode(
  node: CorpusNode,
  rng: Rng,
  pronouns: PronounMap = {},
): string {
  if (typeof node === "string") return node;
  if (isSequence(node))
    return node.seq.map((part) => resolveNode(part, rng, pronouns)).join("");
  if (isWeighted(node)) return resolveNode(node.node, rng, pronouns);
  // Arrays drop non-matching locks before picking, so a mismatch here means the lock isn't an option in an array.
  if (isLocked(node)) {
    if (!lockFits(node, pronouns))
      throw new Error(
        `lock("${node.who}") only works as an option in an array`,
      );
    return resolveNode(node.node, rng, pronouns);
  }

  const options = node.filter((option) => optionFits(option, pronouns));
  if (options.length === 0)
    throw new Error(
      `Every option is locked out for ${JSON.stringify(pronouns)}`,
    );
  return resolveNode(pickWeighted(options, weightOf, rng), rng, pronouns);
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Replaces {tokens} with cast values. The case of the token's last segment picks the case of the output:
 *   {subject.is} -> "is" / "are"
 *   {subject.Is} -> "Is" / "Are"
 *   {Subject}    -> "The Casserole"
 * A filled value can contain tokens of its own (a generation trait that mentions {person}), so this makes a few passes.
 * Unknown tokens are left untouched so tests can catch them.
 */
export function fillTokens(text: string, tokens: TokenMap): string {
  let result = text;
  for (let pass = 0; pass < MAX_FILL_PASSES; pass++) {
    const next = fillOnce(result, tokens);
    if (next === result) break;
    result = next;
  }
  return result;
}

const MAX_FILL_PASSES = 3;

/** Matches a {token}, but not JSON like {"key": ...}. */
export const TOKEN_PATTERN = /\{([A-Za-z]+(?:\.[A-Za-z]+)*)\}/g;

function fillOnce(text: string, tokens: TokenMap): string {
  return text.replace(TOKEN_PATTERN, (match, key: string) => {
    const segments = key.split(".");
    const last = segments[segments.length - 1];
    const capitalize = /^[A-Z]/.test(last);
    segments[segments.length - 1] =
      last.charAt(0).toLowerCase() + last.slice(1);

    const value = tokens[segments.join(".")];
    if (value === undefined) return match;
    return capitalize ? capitalizeFirst(value) : value;
  });
}

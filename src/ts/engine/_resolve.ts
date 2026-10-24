import { pickWeighted, type Rng } from "./_rng.js";
import type { CorpusNode, Sequence, TokenMap, Weighted } from "./_types.js";

function isSequence(node: CorpusNode): node is Sequence {
  return typeof node === "object" && "seq" in node;
}

function isWeighted(node: CorpusNode): node is Weighted {
  return typeof node === "object" && "weight" in node && "node" in node;
}

function weightOf(node: CorpusNode): number {
  return isWeighted(node) ? node.weight : 1;
}

/** Walks a corpus node: strings are literal, arrays pick one by weight, sequences join in order. */
export function resolveNode(node: CorpusNode, rng: Rng): string {
  if (typeof node === "string") return node;
  if (isSequence(node))
    return node.seq.map((part) => resolveNode(part, rng)).join("");
  if (isWeighted(node)) return resolveNode(node.node, rng);
  return resolveNode(pickWeighted(node, weightOf, rng), rng);
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Replaces {tokens} with cast values. The case of the token's last segment picks the case of the output:
 *   {subject.is} -> "is" / "are"
 *   {subject.Is} -> "Is" / "Are"
 *   {Subject}    -> "The Casserole"
 * Unknown tokens are left untouched so tests can catch them.
 */
export function fillTokens(text: string, tokens: TokenMap): string {
  return text.replace(
    /\{([A-Za-z]+(?:\.[A-Za-z]+)*)\}/g,
    (match, key: string) => {
      const segments = key.split(".");
      const last = segments[segments.length - 1];
      const capitalize = /^[A-Z]/.test(last);
      segments[segments.length - 1] =
        last.charAt(0).toLowerCase() + last.slice(1);

      const value = tokens[segments.join(".")];
      if (value === undefined) return match;
      return capitalize ? capitalizeFirst(value) : value;
    },
  );
}

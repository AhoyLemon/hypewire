import { graphemeLength, splitGraphemes } from "../lib/graphemes.js";

export const POST_LIMIT = 300;
export const ELLIPSIS = "…";
const SEPARATOR = "\n\n";

/** Punctuation that looks wrong right before an ellipsis. Closing quotes stay. */
const TRAILING_JUNK = /[\s.,;:!?\-–—“‘(]+$/u;

export interface FittedPost {
  text: string;
  /** The excerpt as posted, ellipsis included. */
  excerpt: string;
}

/** Cuts text to at most `budget` graphemes, backing up to the last whole word. */
function cutToWord(text: string, budget: number): string {
  const chars = splitGraphemes(text);
  if (chars.length <= budget) return text;

  const sliced = chars.slice(0, budget).join("");
  if (/\s/.test(chars[budget])) return sliced;

  const lastSpace = sliced.search(/\s\S*$/);
  return lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
}

/**
 * Builds "headline, blank line, excerpt…" within the limit. The headline is never cut. The excerpt runs until it hits the limit, then ends with an ellipsis, even when it would have fit, so every post reads like a news summary.
 */
export function fitPost(
  headline: string,
  excerpt: string,
  limit: number = POST_LIMIT,
): FittedPost {
  const budget =
    limit -
    graphemeLength(headline) -
    graphemeLength(SEPARATOR) -
    graphemeLength(ELLIPSIS);
  if (budget <= 0)
    throw new Error(
      `Headline is too long for a ${limit}-grapheme post: "${headline}"`,
    );

  const cut = cutToWord(excerpt.trim(), budget).replace(TRAILING_JUNK, "");
  const fitted = cut + ELLIPSIS;
  return { text: headline + SEPARATOR + fitted, excerpt: fitted };
}

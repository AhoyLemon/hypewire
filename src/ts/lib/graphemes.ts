/** Splits text into user-perceived characters (graphemes) rather than UTF-16 code units. */
export function splitGraphemes(text: string): string[] {
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  return [...segmenter.segment(text)].map((part) => part.segment);
}

/** Counts graphemes, matching BlueSky's 300-grapheme post limit. */
export function graphemeLength(text: string): number {
  return splitGraphemes(text).length;
}

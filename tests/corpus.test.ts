import { describe, expect, test } from "bun:test";

import { corpus } from "../src/ts/corpus/_corpus";
import {
  canWrap,
  castTokens,
  resolveSubject,
  SPEAKER_FORMATS,
  subjectFits,
  wrapperFits,
  type Cast,
  type ResolvedGeneration,
} from "../src/ts/engine/_cast";
import {
  generate,
  variantsOf,
  type GeneratedPost,
} from "../src/ts/engine/_generate";
import { fillTokens, TOKEN_PATTERN } from "../src/ts/engine/_resolve";
import type { CorpusNode, Generation } from "../src/ts/engine/_types";
import { ELLIPSIS, POST_LIMIT } from "../src/ts/engine/_truncate";
import { graphemeLength } from "../src/ts/lib/graphemes";

const SEEDS_PER_COMBO = 3;
const RANDOM_POSTS = 5_000;
/** Below this, the excerpt is too squeezed by a long headline to read as a summary. */
const MIN_EXCERPT = 60;

/** Everything that can go wrong with a rendered post. An empty list means it's clean. */
function problems(post: GeneratedPost): string[] {
  const { text, headline, excerpt } = post;
  const written = `${headline}\n${post.debug.fullExcerpt}`;
  const issues: string[] = [];

  if (new RegExp(TOKEN_PATTERN.source).test(written))
    issues.push("unfilled {token}");
  if (/undefined|NaN/.test(written)) issues.push("undefined or NaN");
  if (/ {2}/.test(written)) issues.push("double space");
  if (/\bthey (has|is|was)\b/i.test(written))
    issues.push("“they” with a singular verb");
  if (/\s[,.!?;:]/.test(written)) issues.push("space before punctuation");
  if (/[”’][.,]/.test(written))
    issues.push("period or comma outside a closing quote");
  if (/^[a-z]/.test(headline)) issues.push("headline starts lowercase");
  // A lowercase word after a quoted question is fine ("doing here?” asks Greg"), so only bare ?/! and periods count.
  if (/(\.[”’]?|[!?])\s+[a-z]/.test(written.replace(/\b[ap]\.m\./g, "am")))
    issues.push("sentence starts lowercase");
  if (graphemeLength(text) > POST_LIMIT)
    issues.push(`over ${POST_LIMIT} graphemes`);
  if (!text.startsWith(`${headline}\n\n`)) issues.push("headline was cut");
  if (!text.endsWith(ELLIPSIS)) issues.push("no ellipsis");
  if (graphemeLength(excerpt) < MIN_EXCERPT)
    issues.push(`excerpt under ${MIN_EXCERPT} graphemes`);

  return issues;
}

function describeFailure(
  label: string,
  run: () => GeneratedPost,
): string | null {
  try {
    const post = run();
    const issues = problems(post);
    return issues.length
      ? `${label}: ${issues.join(", ")}\n  ${post.headline}\n  ${post.debug.fullExcerpt}`
      : null;
  } catch (err) {
    return `${label}: threw ${err instanceof Error ? err.message : err}`;
  }
}

describe("corpus coverage", () => {
  test("every structure has at least one subject that fits it", () => {
    const orphans = corpus.structures.filter(
      (structure) => !corpus.subjects.some((s) => subjectFits(s, structure)),
    );
    expect(orphans.map((s) => s.id)).toEqual([]);
  });

  test("every structure and variant renders cleanly with every subject and wrapper that fits it", () => {
    const failures: string[] = [];

    for (const structure of corpus.structures) {
      for (const variant of variantsOf(structure)) {
        for (const subject of corpus.subjects.filter((s) =>
          subjectFits(s, structure),
        )) {
          const fitting = canWrap(structure)
            ? corpus.wrappers.filter((wr) =>
                wrapperFits(wr, resolveSubject(subject)),
              )
            : [];
          const wrapperIds = [null, ...fitting.map((wr) => wr.id)];

          for (const wrapperId of wrapperIds) {
            for (let seed = 1; seed <= SEEDS_PER_COMBO; seed++) {
              const name = variant.id
                ? `${structure.id}:${variant.id}`
                : structure.id;
              const label = `${name} × ${subject.name} × ${wrapperId ?? "unwrapped"} × seed ${seed}`;
              const failure = describeFailure(label, () =>
                generate(corpus, {
                  seed,
                  structureId: structure.id,
                  variantId: variant.id ?? undefined,
                  subjectName: subject.name,
                  wrapperId,
                }),
              );
              if (failure) failures.push(failure);
            }
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });

  test("every generation has the same stereotype traits, none named like a grammar token", () => {
    const grammar = ["is", "isnt", "was", "has", "it", "its", "them", "s"];
    const keysOf = (traits: Record<string, unknown>) =>
      Object.keys(traits).sort().join(", ");
    const expected = keysOf(corpus.cast.generations[0].traits);

    for (const generation of corpus.cast.generations) {
      expect(`${generation.name}: ${keysOf(generation.traits)}`).toBe(
        `${generation.name}: ${expected}`,
      );
    }
    expect(expected.split(", ").filter((key) => grammar.includes(key))).toEqual(
      [],
    );
  });

  test(`${RANDOM_POSTS.toLocaleString()} unforced posts come out clean`, () => {
    const failures: string[] = [];
    for (let seed = 0; seed < RANDOM_POSTS; seed++) {
      const failure = describeFailure(`seed ${seed}`, () =>
        generate(corpus, { seed }),
      );
      if (failure) failures.push(failure);
    }
    expect(failures).toEqual([]);
  });

  test("weights still let every structure and wrapper show up on its own", () => {
    const structures = new Set<string>();
    const wrappers = new Set<string>();
    for (let seed = 0; seed < RANDOM_POSTS; seed++) {
      const { debug } = generate(corpus, { seed });
      structures.add(debug.structureId);
      if (debug.wrapperId) wrappers.add(debug.wrapperId);
    }
    expect([...structures].sort()).toEqual(
      corpus.structures.map((s) => s.id).sort(),
    );
    expect([...wrappers].sort()).toEqual(
      corpus.wrappers.map((wr) => wr.id).sort(),
    );
  });
});

describe("determinism", () => {
  test("the same seed gives the same post", () => {
    expect(generate(corpus, { seed: 42 }).text).toBe(
      generate(corpus, { seed: 42 }).text,
    );
  });

  test("forcing a structure and subject still respects the seed", () => {
    const options = {
      seed: 7,
      structureId: "resurrection",
      subjectName: "Napkins",
    };
    expect(generate(corpus, options).text).toBe(generate(corpus, options).text);
  });
});

/** Every leaf string in a pool made of plain options and w() (no seq). */
function leaves(node: CorpusNode): string[] {
  if (typeof node === "string") return [node];
  if (Array.isArray(node)) return node.flatMap(leaves);
  if ("node" in node) return leaves(node.node);
  throw new Error("leaves() only handles plain options and w(), not seq()");
}

function longest(items: string[]): string {
  return items.reduce(
    (best, item) => (graphemeLength(item) > graphemeLength(best) ? item : best),
    "",
  );
}

function asResolved(generation: Generation): ResolvedGeneration {
  const { name, plural } = generation;
  return { name, plural, age: 0, speaker: "", traits: {} };
}

/** Cast fields Rage-Bait headlines never use, so blanks are fine. */
const blankCast: Omit<Cast, "subject" | "generation" | "rival"> = {
  model: { name: "", new: "", old: "" },
  expert: { first: "", last: "", title: "" },
  person: { first: "", last: "", age: 0 },
  relative: "",
  startup: "",
  city: { name: "" },
  money: "",
  age: 0,
  percent: 0,
  timeframe: { name: "" },
  group: { name: "" },
  product: { name: "" },
};

describe("punchlines that must survive the cut", () => {
  test("Rage-Bait's hypocrisy line fits whole even under the longest possible headline", () => {
    const rageBait = corpus.structures.find((s) => s.id === "rageBait");
    if (!rageBait?.headline) throw new Error("Rage-Bait has no headline");
    const templates = leaves(rageBait.headline);
    const pools = corpus.cast;
    const name = `${longest(leaves(pools.firstNames))} ${longest(leaves(pools.lastNames))}`;
    const cut: string[] = [];

    for (const rival of pools.generations) {
      // The longest opening: every hypocrisy line with the longest name, the oldest age, and the widest format.
      const speakers = SPEAKER_FORMATS.map(({ format }) =>
        format(name, rival.ages[1]),
      );
      const opening = longest(
        leaves(rival.traits.hypocrisy).flatMap((line) =>
          speakers.map((speaker) => fillTokens(line, { speaker })),
        ),
      );

      // The longest headline this rival can appear under: every template, partner generation, and subject.
      const headlines: string[] = [];
      for (const generation of pools.generations) {
        if (generation.name === rival.name) continue;
        for (const subject of corpus.subjects) {
          const tokens = castTokens({
            ...blankCast,
            subject: resolveSubject(subject),
            generation: asResolved(generation),
            rival: asResolved(rival),
          });
          headlines.push(...templates.map((t) => fillTokens(t, tokens)));
        }
      }
      const headline = longest(headlines);

      const room = POST_LIMIT - graphemeLength(headline) - 3;
      if (graphemeLength(opening) > room) {
        cut.push(
          `${rival.name}: ${graphemeLength(opening)} graphemes, room for ${room}\n  ${headline}\n  ${opening}`,
        );
      }
    }

    expect(cut).toEqual([]);
  });
});

describe("generations", () => {
  test("every generation has a sensible age range", () => {
    for (const { name, ages } of corpus.cast.generations) {
      const [min, max] = ages;
      expect(`${name}: ${min <= max && min > 0}`).toBe(`${name}: true`);
    }
  });
});

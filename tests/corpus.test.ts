import { describe, expect, test } from "bun:test";

import { corpus } from "../src/ts/corpus/_corpus";
import {
  canWrap,
  resolveSubject,
  subjectFits,
  wrapperFits,
} from "../src/ts/engine/_cast";
import { generate, type GeneratedPost } from "../src/ts/engine/_generate";
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

  if (/[{}]/.test(written)) issues.push("unfilled {token}");
  if (/undefined|NaN/.test(written)) issues.push("undefined or NaN");
  if (/ {2}/.test(written)) issues.push("double space");
  if (/\s[,.!?;:]/.test(written)) issues.push("space before punctuation");
  if (/[”’][.,]/.test(written))
    issues.push("period or comma outside a closing quote");
  if (/^[a-z]/.test(headline)) issues.push("headline starts lowercase");
  if (/[.!?][”’]?\s+[a-z]/.test(written.replace(/\b[ap]\.m\./g, "am")))
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

  test("every structure renders cleanly with every subject and wrapper that fits it", () => {
    const failures: string[] = [];

    for (const structure of corpus.structures) {
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
            const label = `${structure.id} × ${subject.name} × ${wrapperId ?? "unwrapped"} × seed ${seed}`;
            const failure = describeFailure(label, () =>
              generate(corpus, {
                seed,
                structureId: structure.id,
                subjectName: subject.name,
                wrapperId,
              }),
            );
            if (failure) failures.push(failure);
          }
        }
      }
    }

    expect(failures).toEqual([]);
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

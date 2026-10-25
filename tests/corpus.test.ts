import { describe, expect, test } from "bun:test";

import { corpus } from "../src/ts/corpus/_corpus";
import {
  canWrap,
  castTokens,
  pronounTokens,
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
import { fillTokens, isLocked, TOKEN_PATTERN } from "../src/ts/engine/_resolve";
import {
  lock,
  type Corpus,
  type CorpusNode,
  type Generation,
  type Locked,
  type Pronouns,
} from "../src/ts/engine/_types";
import { ELLIPSIS, POST_LIMIT } from "../src/ts/engine/_truncate";
import { graphemeLength } from "../src/ts/lib/graphemes";

const SEEDS_PER_COMBO = 3;
const RANDOM_POSTS = 5_000;
const POSTS_PER_PRONOUN = 2_000;
const PRONOUN_SETS: Pronouns[] = ["he", "she", "they"];
/** Below this, the post text is too thin to read as a summary. */
const MIN_EXCERPT = 60;

/** Everything that can go wrong with a rendered post. An empty list means it's clean. */
function problems(post: GeneratedPost): string[] {
  const { headline, excerpt } = post;
  const written = `${headline}\n${post.debug.fullExcerpt}`;
  const issues: string[] = [];

  if (new RegExp(TOKEN_PATTERN.source).test(written))
    issues.push("unfilled {token}");
  if (/undefined|NaN/.test(written)) issues.push("undefined or NaN");
  if (/ {2}/.test(written)) issues.push("double space");
  if (/\bthey (has|is|was|isn't|wasn't|doesn't)\b/i.test(written))
    issues.push("“they” with a singular verb");
  // Correct subjunctives ("if he were") and questions ("does she have") trip this too, so reword those rather than switching to {x.was}.
  if (/\b(he|she) (have|are|were|aren't|weren't)\b/i.test(written))
    issues.push("“he” or “she” with a plural verb");
  if (/\s[,.!?;:]/.test(written)) issues.push("space before punctuation");
  // An option that ends in its own period runs into the one after it ("mom..", "gold.,”"). "a.m.," is fine.
  if (/[.!?][.,]/.test(written.replace(/\b([ap])\.m\.,/g, "$1m,")))
    issues.push("doubled punctuation");
  if (/[”’][.,]/.test(written))
    issues.push("period or comma outside a closing quote");
  if (/^[a-z]/.test(headline)) issues.push("headline starts lowercase");
  // A lowercase word after a quoted question is fine ("doing here?” asks Greg"), so only bare ?/! and periods count.
  if (/(\.[”’]?|[!?])\s+[a-z]/.test(written.replace(/\b[ap]\.m\./g, "am")))
    issues.push("sentence starts lowercase");
  if (graphemeLength(excerpt) > POST_LIMIT)
    issues.push(`over ${POST_LIMIT} graphemes`);
  if (!excerpt.endsWith(ELLIPSIS)) issues.push("no ellipsis");
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
    expect(generate(corpus, { seed: 42 })).toEqual(
      generate(corpus, { seed: 42 }),
    );
  });

  test("forcing a structure and subject still respects the seed", () => {
    const options = {
      seed: 7,
      structureId: "resurrection",
      subjectName: "Napkins",
    };
    expect(generate(corpus, options)).toEqual(generate(corpus, options));
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
  return {
    name,
    plural,
    age: 0,
    speaker: "",
    speakerPronouns: "they",
    traits: {},
  };
}

/** Cast fields Rage-Bait headlines never use, so blanks are fine. */
const blankCast: Omit<Cast, "subject" | "generation" | "rival"> = {
  model: { name: "", new: "", old: "" },
  expert: { first: "", last: "", pronouns: "they", title: "" },
  person: { first: "", last: "", pronouns: "they", age: 0 },
  relative: "",
  startup: "",
  city: { name: "" },
  money: "",
  age: 0,
  percent: 0,
  timeframe: { name: "" },
  group: { name: "" },
  product: { name: "" },
  genderedWords: [],
};

describe("punchlines that must survive the cut", () => {
  test("Rage-Bait's hypocrisy line fits whole in the post", () => {
    const pools = corpus.cast;
    const name = `${longest(pools.firstNames.map((n) => n.name))} ${longest(leaves(pools.lastNames))}`;
    const room = POST_LIMIT - graphemeLength(ELLIPSIS);
    const cut: string[] = [];

    for (const rival of pools.generations) {
      // The longest opening: every hypocrisy line with the longest name, the oldest age, the widest format, and every set of pronouns.
      const speakers = SPEAKER_FORMATS.map(({ format }) =>
        format(name, rival.ages[1]),
      );
      const opening = longest(
        leaves(rival.traits.hypocrisy).flatMap((line) =>
          speakers.flatMap((speaker) =>
            PRONOUN_SETS.map((pronouns) =>
              fillTokens(line, {
                speaker,
                ...pronounTokens("speaker", pronouns, pools.genderedWords),
              }),
            ),
          ),
        ),
      );

      if (graphemeLength(opening) > room) {
        cut.push(
          `${rival.name}: ${graphemeLength(opening)} graphemes, room for ${room}\n  ${opening}`,
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

/** The same corpus, except every first name uses these pronouns. */
function everyoneUses(pronouns: Pronouns): Corpus {
  const firstNames = corpus.cast.firstNames.map((n) => ({ ...n, pronouns }));
  return { ...corpus, cast: { ...corpus.cast, firstNames } };
}

const CAST_WHO = ["expert", "person", "generation.speaker", "rival.speaker"];

/** Every place the corpus gets resolved, and who a lock() there can name. */
function corpusRoots(): Array<{
  label: string;
  node: CorpusNode;
  who: string[];
}> {
  const structureRoots = corpus.structures.flatMap((structure) =>
    variantsOf(structure).flatMap((variant) => {
      const label = variant.id ? `${structure.id}:${variant.id}` : structure.id;
      const parts = [{ label: `${label} headline`, node: variant.headline }];
      if (variant.excerpt)
        parts.push({ label: `${label} excerpt`, node: variant.excerpt });
      return parts.map((part) => ({ ...part, who: CAST_WHO }));
    }),
  );
  const traitRoots = corpus.cast.generations.flatMap((generation) =>
    Object.entries(generation.traits).map(([key, node]) => ({
      label: `${generation.name} ${key}`,
      node,
      who: ["speaker"],
    })),
  );
  return [
    { label: "sharedExcerpt", node: corpus.sharedExcerpt, who: CAST_WHO },
    ...structureRoots,
    { label: "relatives", node: corpus.cast.relatives, who: ["expert"] },
    ...traitRoots,
  ];
}

// Array.isArray doesn't narrow a readonly array out of a union, so this does.
function isPick(node: CorpusNode): node is readonly CorpusNode[] {
  return Array.isArray(node);
}

/** Every literal string in a node, through seq(), w() and lock(). */
function strings(node: CorpusNode): string[] {
  if (typeof node === "string") return [node];
  if (isPick(node)) return node.flatMap(strings);
  if ("seq" in node) return node.seq.flatMap(strings);
  return strings(node.node);
}

/** Every way to give these people pronouns: 3ⁿ combinations for n people. */
function pronounCombos(names: string[]): Array<Record<string, Pronouns>> {
  return names.reduce<Array<Record<string, Pronouns>>>(
    (combos, name) =>
      combos.flatMap((combo) =>
        PRONOUN_SETS.map((pronouns) => ({ ...combo, [name]: pronouns })),
      ),
    [{}],
  );
}

/** The lock() calls wrapped around one option, looking through any w(). */
function locksOn(option: CorpusNode): Locked[] {
  if (typeof option === "string" || isPick(option)) return [];
  if ("seq" in option) return [];
  if (isLocked(option)) return [option, ...locksOn(option.node)];
  return locksOn(option.node);
}

function lockProblems(
  node: CorpusNode,
  who: string[],
  isOption: boolean,
): string[] {
  if (typeof node === "string") return [];
  if (isPick(node)) {
    const found = node.flatMap((option) => lockProblems(option, who, true));
    // An array can lock more than one person, so check every mix of their pronouns, not each person alone.
    const locked = [...new Set(node.flatMap(locksOn).map((l) => l.who))];
    for (const combo of pronounCombos(locked)) {
      const open = node.some((option) =>
        locksOn(option).every((l) => combo[l.who] === l.pronouns),
      );
      if (!open) {
        const cast = Object.entries(combo)
          .map(([name, pronouns]) => `${name} as “${pronouns}”`)
          .join(", ");
        found.push(
          `nothing left for ${cast} in ${JSON.stringify(node).slice(0, 80)}`,
        );
      }
    }
    return found;
  }
  if ("seq" in node)
    return node.seq.flatMap((part) => lockProblems(part, who, false));
  if (isLocked(node)) {
    const found = lockProblems(node.node, who, isOption);
    if (!isOption) found.push(`lock("${node.who}") outside an array`);
    if (!who.includes(node.who))
      found.push(
        `lock("${node.who}") where only ${who.join(", ")} can be named`,
      );
    return found;
  }
  return lockProblems(node.node, who, isOption);
}

describe("pronouns", () => {
  test("every lock() is an option in an array, names someone who's there, and leaves an option for he, she and they", () => {
    const found = corpusRoots().flatMap(({ label, node, who }) =>
      lockProblems(node, who, false).map((problem) => `${label}: ${problem}`),
    );
    expect(found).toEqual([]);
  });

  test("the lock check catches an array that two people's locks can empty together", () => {
    const corner = [lock("expert", "he", "A"), lock("person", "she", "B")];
    expect(lockProblems(corner, CAST_WHO, false)).toEqual([
      expect.stringContaining("expert as “she”, person as “he”"),
      expect.stringContaining("expert as “she”, person as “they”"),
      expect.stringContaining("expert as “they”, person as “he”"),
      expect.stringContaining("expert as “they”, person as “they”"),
    ]);
  });

  test("a pronoun token is never followed by a plain-text verb that only agrees with some pronouns", () => {
    // "{person.he} has" renders "they has", and "{person.he}'s" renders "they's". The verb needs {x.has}, {x.is} or {x.s}.
    const agreeing =
      /^(is|are|was|were|has|have|do|does|isn't|aren't|wasn't|weren't|hasn't|haven't|don't|doesn't)$/;
    const notVerbs = ["always", "sometimes", "perhaps"];
    const pronounThenWord =
      /\{[A-Za-z.]+\.[hH]e\}(?: ([A-Za-z']+)(?![A-Za-z'{])|')/g;
    const found: string[] = [];

    for (const { label, node } of corpusRoots()) {
      for (const text of strings(node)) {
        for (const [match, word] of text.matchAll(pronounThenWord)) {
          const verb = word?.toLowerCase();
          const wrong =
            verb === undefined ||
            agreeing.test(verb) ||
            (verb.endsWith("s") && !notVerbs.includes(verb));
          if (wrong) found.push(`${label}: “${match}” in “${text}”`);
        }
      }
    }
    expect(found).toEqual([]);
  });

  test("speaker pronouns work two dots deep, under a generation or rival", () => {
    const [generation, rival] = corpus.cast.generations;
    const tokens = castTokens({
      ...blankCast,
      subject: resolveSubject(corpus.subjects[0]),
      generation: { ...asResolved(generation), speakerPronouns: "she" },
      rival: { ...asResolved(rival), speakerPronouns: "they" },
    });
    const line = (prefix: string) =>
      `{${prefix}.He} {${prefix}.isnt} sure, {${prefix}.was} never sure, and {${prefix}.has} {${prefix}.his} doubts.`;

    expect(fillTokens(line("generation.speaker"), tokens)).toBe(
      "She isn't sure, was never sure, and has her doubts.",
    );
    expect(fillTokens(line("rival.speaker"), tokens)).toBe(
      "They aren't sure, were never sure, and have their doubts.",
    );
  });

  test("gendered words are named like tokens and don't shadow a pronoun, verb, or name", () => {
    const taken = [
      "first",
      "last",
      "title",
      "age",
      ...Object.keys(pronounTokens("x", "he", [])).map((key) => key.slice(2)),
    ];
    const keys = corpus.cast.genderedWords.map(([he]) => he);
    expect(
      keys.filter((key) => !/^[a-z]+$/.test(key) || taken.includes(key)),
    ).toEqual([]);
    expect(new Set(keys).size).toBe(keys.length);
  });

  for (const pronouns of PRONOUN_SETS) {
    test(`${POSTS_PER_PRONOUN.toLocaleString()} unforced posts come out clean when everyone is “${pronouns}”`, () => {
      const forced = everyoneUses(pronouns);
      const failures: string[] = [];
      for (let seed = 0; seed < POSTS_PER_PRONOUN; seed++) {
        const failure = describeFailure(`${pronouns}, seed ${seed}`, () =>
          generate(forced, { seed }),
        );
        if (failure) failures.push(failure);
      }
      expect(failures).toEqual([]);
    });
  }
});

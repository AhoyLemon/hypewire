import { describe, expect, test } from "bun:test";

import {
  applyWrapper,
  pronounTokens,
  resolveSubject,
  wrapperFits,
} from "../src/ts/engine/_cast";
import { fillTokens, resolveNode } from "../src/ts/engine/_resolve";
import { seededRng } from "../src/ts/engine/_rng";
import { lock, seq, w, type GenderedWord } from "../src/ts/engine/_types";

describe("resolveNode", () => {
  test("returns strings as-is", () => {
    expect(resolveNode("plain text", () => 0)).toBe("plain text");
  });

  test("joins a sequence in order", () => {
    expect(resolveNode(seq("a", "b", "c"), () => 0)).toBe("abc");
  });

  test("picks exactly one option from an array", () => {
    expect(resolveNode(["first", "middle", "last"], () => 0)).toBe("first");
    expect(resolveNode(["first", "middle", "last"], () => 0.99)).toBe("last");
  });

  test("resolves picks nested inside sequences, and sequences nested inside picks", () => {
    expect(resolveNode(seq("x", ["a", "b"], "y"), () => 0.99)).toBe("xby");
    expect(resolveNode([seq("one", "two")], () => 0)).toBe("onetwo");
  });

  test("weights skew the pick toward heavier options", () => {
    const rng = seededRng(1);
    const node = [w("heavy", 9), "light"];
    let heavy = 0;
    for (let i = 0; i < 10_000; i++)
      if (resolveNode(node, rng) === "heavy") heavy++;
    expect(heavy / 10_000).toBeGreaterThan(0.85);
    expect(heavy / 10_000).toBeLessThan(0.95);
  });
});

describe("fillTokens", () => {
  const tokens = {
    subject: "the Casserole",
    "subject.is": "is",
    "subject.inline": "the casserole",
  };

  test("fills known tokens", () => {
    expect(fillTokens("The End of {subject}", tokens)).toBe(
      "The End of the Casserole",
    );
  });

  test("capitalizes the output when the token's last segment is capitalized", () => {
    expect(fillTokens("{Subject} {subject.Is} Dead", tokens)).toBe(
      "The Casserole Is Dead",
    );
    expect(fillTokens("{subject.Inline} {subject.is} over.", tokens)).toBe(
      "The casserole is over.",
    );
  });

  test("leaves unknown tokens alone so tests can catch them", () => {
    expect(fillTokens("{nope} and {subject.nope}", tokens)).toBe(
      "{nope} and {subject.nope}",
    );
  });

  test("fills tokens that appear inside a filled value", () => {
    const nested = {
      person: "Dag Mulch",
      "rival.hypocrisy": "“Nobody works,” says {person}, who retired at 52.",
    };
    expect(fillTokens("{rival.hypocrisy}", nested)).toBe(
      "“Nobody works,” says Dag Mulch, who retired at 52.",
    );
  });

  test("ignores JSON braces", () => {
    expect(fillTokens('{"author": "{subject}"}', tokens)).toBe(
      '{"author": "the Casserole"}',
    );
  });
});

describe("lock", () => {
  const relatives = [
    lock("expert", "he", "Godfather"),
    lock("expert", "she", "Godmother"),
    "Cousin",
  ];

  test("skips options locked to other pronouns", () => {
    expect(resolveNode(relatives, () => 0, { expert: "she" })).toBe(
      "Godmother",
    );
    expect(resolveNode(relatives, () => 0, { expert: "they" })).toBe("Cousin");
  });

  test("keeps a w() weight on either side of the lock", () => {
    // 0.85 lands on "heavy" only if its weight of 9 survives the lock.
    const roll = () => 0.85;
    const pronouns = { expert: "he" } as const;
    expect(
      resolveNode(
        [lock("expert", "he", w("heavy", 9)), "light"],
        roll,
        pronouns,
      ),
    ).toBe("heavy");
    expect(
      resolveNode(
        [w(lock("expert", "he", "heavy"), 9), "light"],
        roll,
        pronouns,
      ),
    ).toBe("heavy");
  });

  test("throws when every option is locked out, or the lock names someone who isn't there", () => {
    expect(() =>
      resolveNode([lock("expert", "he", "Godfather")], () => 0, {
        expert: "she",
      }),
    ).toThrow("locked out");
    expect(() => resolveNode(relatives, () => 0, { speaker: "he" })).toThrow(
      "isn't in the cast",
    );
  });
});

describe("pronounTokens", () => {
  const words: GenderedWord[] = [["boy", "girl", "kid"]];
  const line =
    "{expert.He} {expert.is} a {expert.boy} who thinks {expert.hes} right about {expert.his} kids, and {expert.he} say{expert.s} so {expert.himself}. Ask {expert.him}.";

  test("fills pronouns, agreeing verbs, and gendered words", () => {
    expect(fillTokens(line, pronounTokens("expert", "she", words))).toBe(
      "She is a girl who thinks she's right about her kids, and she says so herself. Ask her.",
    );
  });

  test("singular “they” takes plural verbs", () => {
    expect(fillTokens(line, pronounTokens("expert", "they", words))).toBe(
      "They are a kid who thinks they're right about their kids, and they say so themself. Ask them.",
    );
  });
});

describe("seededRng", () => {
  test("the same seed gives the same sequence", () => {
    const a = seededRng(8675309);
    const b = seededRng(8675309);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  test("different seeds give different sequences", () => {
    expect(seededRng(1)()).not.toBe(seededRng(2)());
  });
});

describe("applyWrapper", () => {
  test("wraps the bare name, and wrapped subjects are singular with no activity", () => {
    const napkins = resolveSubject({
      name: "Napkins",
      plural: true,
      activity: "Folding",
    });
    const wrapped = applyWrapper(napkins, {
      id: "big",
      name: "Big {bare}",
      inline: "Big {bare}",
    });
    expect(wrapped).toMatchObject({
      name: "Big Napkins",
      inline: "Big Napkins",
      plural: false,
      wrapperId: "big",
    });
    expect(wrapped.activity).toBeUndefined();
  });

  test("drops a leading 'the' before wrapping", () => {
    const casserole = resolveSubject({ name: "the Casserole" });
    const wrapped = applyWrapper(casserole, {
      id: "economy",
      name: "the {bare} Economy",
      inline: "the {bareInline} economy",
    });
    expect(wrapped.name).toBe("the Casserole Economy");
    expect(wrapped.inline).toBe("the casserole economy");
    expect(wrapped.bare).toBe("Casserole Economy");
  });

  test("singular-only wrappers skip plural subjects, so nothing reads “Bowling Leagues Culture”", () => {
    const culture = {
      id: "culture",
      name: "{bare} Culture",
      inline: "{bareInline} culture",
      allowPlural: false,
    };
    expect(
      wrapperFits(
        culture,
        resolveSubject({ name: "Bowling Leagues", plural: true }),
      ),
    ).toBe(false);
    expect(wrapperFits(culture, resolveSubject({ name: "Small Talk" }))).toBe(
      true,
    );
  });
});

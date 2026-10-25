import { describe, expect, test } from "bun:test";

import { rollPost } from "../scripts/_postHistory";
import { corpus } from "../src/ts/corpus/_corpus";

const ROLLS_PER_STRUCTURE = 25;

describe("rollPost", () => {
  test("never repeats the structure it's told to avoid", () => {
    const repeats: string[] = [];
    for (const { id } of corpus.structures)
      for (let roll = 0; roll < ROLLS_PER_STRUCTURE; roll++) {
        const post = rollPost(id);
        if (post.debug.structureId === id)
          repeats.push(`${id} (seed ${post.debug.seed})`);
      }
    expect(repeats).toEqual([]);
  });
});

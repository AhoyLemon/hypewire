import chalk from "chalk";

import { corpus } from "../src/ts/corpus/_corpus.js";
import { generate } from "../src/ts/engine/_generate.js";
import { POST_LIMIT } from "../src/ts/engine/_truncate.js";

/** Prints a batch of posts for eyeballing. Usage: bun run sample [count] */
const requested = Number.parseInt(process.argv[2] ?? "", 10);
const count = Number.isFinite(requested) && requested > 0 ? requested : 10;

console.log();
for (let i = 0; i < count; i++) {
  const post = generate(corpus);
  const { seed, structureLabel, wrapperId, graphemes } = post.debug;
  const wrapper = wrapperId ? ` · wrapper: ${wrapperId}` : "";

  console.log(
    chalk.dim(
      `seed ${seed} · ${structureLabel}${wrapper} · ${graphemes}/${POST_LIMIT}`,
    ),
  );
  console.log(chalk.bold(post.headline));
  console.log(`${post.excerpt}\n`);
}

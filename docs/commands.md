# Commands

- `bun install`: install dependencies.
- `bun run dev`: start the workbench at http://localhost:3000.
- `bun run sample [count]`: print a batch of posts in the terminal (10 by default).
- `bun run card [count]`: render headline images and a page that mocks them up as Bluesky posts, at http://localhost:3000/out/cards/ while `bun run dev` is running. It renders one post per structure, `count` random ones (6 by default), and the longest Pull Quote headline it can find.
- `bun run post:bluesky --dry-run`: generate the post the bot would send, without sending it. It prints the text and saves the image to `out/post-<seed>.png`. Drop `--dry-run` and it posts for real, so see [posting](posting.md) first.
- `bun run test`: check Sass and TypeScript, then run the unit tests.
- `bun run build`: build the Sass, Pug and TypeScript.

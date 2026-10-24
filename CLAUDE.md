# Hypewire

A Bluesky bot that posts fake AI-hype headlines and excerpts, built from a hand-written corpus and a seeded, weighted random walk. The README is the source of truth for how the corpus works; read its "Writing the corpus" section before editing anything in `src/ts/corpus/`.

## Conventions

- Bun, not npm or tsx, for installs and scripts.
- The engine (`src/ts/engine/`) is pure TypeScript with no DOM or Node APIs, so the same code runs in the workbench, the post script and the tests. Imports use `.js` extensions because `tsc` compiles `src/ts` straight to browser ES modules in `js/min/`.
- Corpus text is plain text with curly quotes (“ ”) and straight apostrophes. No HTML.
- Every person, company, investor and outlet in the corpus is fictional. Keep it that way.
- Use the capitalized token form (`{Subject}`, `{subject.Is}`) at the start of a headline or sentence.
- After any corpus change, run `bun run test`. `tests/corpus.test.ts` is the safety net for grammar and length bugs, so extend its `problems()` checks when a new kind of mistake shows up.
- Vue comes from a CDN `<script>` tag (`src/pug/partials/_javascripts.pug`), typed with `declare const Vue: typeof import("vue")`. Don't add a bundler for it.

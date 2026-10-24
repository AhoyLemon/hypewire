# Hypewire

A Bluesky bot that posts fake AI-hype headlines and excerpts, built from a hand-written corpus and a seeded, weighted random walk. The README is the source of truth for how the corpus works; read its "Writing the corpus" section before editing anything in `src/ts/corpus/`.

## Conventions

- Bun, not npm or tsx, for installs and scripts.
- The engine (`src/ts/engine/`) is pure TypeScript with no DOM or Node APIs, so the same code runs in the workbench, the post script and the tests. Imports use `.js` extensions because `tsc` compiles `src/ts` straight to browser ES modules in `js/min/`.
- Corpus text is plain text with curly quotes (“ ”) and straight apostrophes. No HTML.
- Real brands are fine as cultural signifiers (a Liquid Death wedding, an H&M dressing room). Never make a real company or person the subject of a made-up claim about what they do. Quoted people, experts, startups and investors are always invented.
- Use the capitalized token form (`{Subject}`, `{subject.Is}`) at the start of a headline or sentence.
- After any corpus change, run `bun run test`. `tests/corpus.test.ts` is the safety net for grammar and length bugs, so extend its `problems()` checks when a new kind of mistake shows up.
- Vue comes from a CDN `<script>` tag (`src/pug/partials/_javascripts.pug`), typed with `declare const Vue: typeof import("vue")`. Don't add a bundler for it.

## Writing corpus jokes

Lemon's general comedy preferences (go too far, specific beats generic, people tell on themselves, twist the format now and then) live in their writing preferences and apply here. On top of those, for this project:

- Put the joke in the lede and the quote. The cut usually drops the background and kicker.
- The subject has to earn its place. A structure doesn't need to mention it, and the Study and the Market Panic deliberately skip the subject-heavy generic pools.
- The narrator never judges. In Rage-Bait, the angry generation's spokesperson gives themselves away through their own attribution (`hypocrisy`), and the generation using AI just gets a harmless `quirk`.
- Keep the README to the mechanics. Joke-craft notes belong here, not there.

## Working with Lemon on this repo

- Corpus changes happen in rounds of notes. Commit at the end of each round, and don't bring up PRs until Lemon says it's ready.
- Lemon edits the corpus by hand between rounds. Read the current file before changing it, keep the manual edits, and when Lemon is mid-edit, offer options in chat instead of editing the file.

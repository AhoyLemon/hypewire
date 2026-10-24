# Hypewire

AI hype headlines about the end of obscure things. A bot posts one a day to Bluesky.

> **Millennials Killed Leaving a Voicemail. AI Could Bring It Back.**
>
> For years, leaving a voicemail lay quietly in the ground. Then Lattice of Vibes showed up with a shovel and a Series A. “Leaving a voicemail was dead for a reason,” admits Sandford Blatherwick, VP of Inevitability at Lattice of Vibes…

It isn't agentic. Like [sextips](https://github.com/AhoyLemon/sextips), it's a hand-written corpus and a weighted dice roll. The project was started from [startHere](https://github.com/AhoyLemon/startHere).

## Commands

- `bun install`: install dependencies.
- `bun run dev`: start the workbench at http://localhost:3000.
- `bun run sample [count]`: print a batch of posts in the terminal (10 by default).
- `bun run post:bluesky --dry-run`: generate the post the bot would send, without sending it.
- `bun run test`: check Sass and TypeScript, then run the unit tests.
- `bun run build`: build the Sass, Pug and TypeScript.

## How a post gets made

1. Pick a **structure** by weight (The Death Notice, The Resurrection, The Pull Quote and so on).
2. Pick the **cast** once, so the headline and excerpt agree: a subject that fits the structure (sometimes dressed in a wrapper like "Big {X}"), a fake expert, a fake startup, a city, a generation, and some numbers.
3. Resolve the headline and the excerpt, then fill in their `{tokens}` from the cast.
4. Fit the post to Bluesky's 300 graphemes. The headline is never cut. The excerpt runs until it hits the limit, gets cut at a word boundary, and ends in `…` so it reads like a news summary.

Every post comes from a seed. The same seed (plus the same forced structure or subject) always gives the same post.

## Writing the corpus

Everything you'd edit for jokes lives in `src/ts/corpus/`:

| File | What's in it |
| --- | --- |
| `structures/_*.ts` | One file per headline structure, with its headline options and (optionally) its own excerpt |
| `_subjects.ts` | The things AI is about to end, with their grammar |
| `_wrappers.ts` | "the {X} Economy", "Big {X}" and friends, plus how often they show up. `allowPlural: false` keeps a wrapper off plural subjects, so nothing reads "Bowling Leagues Culture" |
| `_castPools.ts` | Fake names, titles, startups, cities, generations, timeframes, groups, products |
| `_excerpts.ts` | The generic lede, quote, background and kicker pools that structures fall back on |
| `_corpus.ts` | The index that ties it all together |

### Syntax

- A plain string is literal text: `"Is AI Quietly Killing {subject}?"`
- An array means "pick one": `["Millennials", "Gen Z"]`
- `w(option, weight)` makes an option more or less likely. Unweighted options count as 1.
- `seq(a, b, c)` joins its parts in order. Each part can be a string, an array or another `seq`.

### Tokens

| Token | Example |
| --- | --- |
| `{subject}` | the Casserole · Napkins |
| `{subject.bare}` | Casserole (no leading "the") |
| `{subject.inline}` | the casserole (for mid-sentence use) |
| `{subject.bareInline}` | casserole (mid-sentence, no leading "the") |
| `{subject.is}` `{subject.isnt}` `{subject.was}` `{subject.has}` | is / are, isn't / aren't, was / were, has / have |
| `{subject.it}` `{subject.its}` `{subject.them}` | it / they, it's / they're, it / them |
| `{subject.s}` | "s" or nothing, for verbs: `Need{subject.s}` |
| `{subject.activity}` `{subject.activityInline}` | Whittling · whittling (only on subjects that have one) |
| `{generation}` `{rival}` | Millennials · Gen Z, with the same `.is` / `.was` / `.has` / `.s` grammar |
| `{expert}` `{expert.first}` `{expert.last}` `{expert.title}` | Brindle Thistlewick, Chief Vibes Officer |
| `{person}` `{person.first}` `{person.last}` `{person.age}` | a second fake person, for anecdotes |
| `{relative}` | Estranged Uncle of AI |
| `{startup}` `{city}` `{money}` `{age}` `{percent}` | Frothr, Duluth, $40M, 19, 61 |
| `{timeframe}` `{group}` `{product}` | each with an `.inline` form for mid-sentence use |

**Capitalize the token to capitalize the output.** The case of the last part of the token decides it: `{subject.Is}` gives "Is" or "Are", and `{Subject}` gives "The Casserole". Use the capitalized form at the start of a headline or sentence.

### Adding a subject

Add it to `_subjects.ts`. Set `plural: true` for plural nouns, `activity` if it works after "Vibe-", and `inline` when lowercasing the name would mangle a proper noun (for example `"the Minnesota goodbye"`).

### Adding a structure

Create `structures/_yourStructure.ts`, export a `Structure`, and add it to `_corpus.ts`. Use `requires: ["activity"]` if it needs `{subject.activity}`.

Every structure should have its own excerpt, built with `excerptWith({ lede, quote, background, kicker })`. Any part you leave out falls back to the generic pool in `_excerpts.ts`. To mix the generic pool into your own at a lower rate, add it as one weighted option: `lede: ["your line", "another line", w(ledes, 1)]`.

### Rules of thumb

- **Put the joke first.** The excerpt almost always gets cut off, so the funny part belongs in the lede and the quote. The background and kicker pools mostly exist to get cut off.
- **Keep everyone fictional.** No real people, companies, outlets or investors.
- **Run `bun run test` after editing.** The coverage test renders every structure with every subject and wrapper that fits it, and fails on unfilled tokens, lowercase sentence starts, double spaces, or posts that don't fit.

## The workbench

`bun run dev` serves a local page for testing the corpus. You can force a structure and/or a subject, type a seed, generate a batch of 20, and open the full excerpt from before the cut. The URL (`?seed=…&structure=…&subject=…`) reproduces whatever is on screen, which is handy when a post comes out broken or perfect.

It's only for local use for now. `.github/workflows/deploy.yml.example` is left as an example on purpose, so nothing gets published.

## Posting

`.github/workflows/post-bluesky.yml` posts once a day at a random time between 9am and 9pm Central. After each scheduled run, `scripts/reschedule-bluesky.ts` picks tomorrow's time and commits it back to the workflow.

To turn it on:

1. Create the Bluesky account and an [app password](https://bsky.app/settings/app-passwords).
2. Add these repository secrets: `BLUESKY_IDENTIFIER`, `BLUESKY_APP_PASSWORD`, and `WORKFLOW_PAT` (a token with `contents` and `workflows` write access, so the schedule commit can edit a workflow file).
3. Run the workflow by hand from the Actions tab to send a test post. Manual runs always post.
4. Set the repository variable `POSTING_ENABLED` to `true` to start the daily schedule. Set it to anything else to pause it.

Each run's job summary includes the post's seed, so you can open it in the workbench with `?seed=`.

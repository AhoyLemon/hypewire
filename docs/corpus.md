# Writing the corpus

Everything you'd edit for jokes lives in `src/ts/corpus/`. Run `bun run test` after every change, because it renders every structure with every subject that fits it and prints the exact post when something breaks.

## How a post gets made

1. Pick a **structure** by weight (The Death Notice, The Resurrection, The Pull Quote and so on).
2. Pick the **cast** once, so the headline and excerpt agree: a subject that fits the structure (sometimes dressed in a wrapper like "Big {X}"), a fake expert, a fake startup, a city, a generation, and some numbers.
3. Resolve the headline and the excerpt, then fill in their `{tokens}` from the cast.
4. Fit the excerpt to Bluesky's 300 graphemes. It's the whole post text, since the headline goes in an image. The excerpt runs until it hits the limit, gets cut at a word boundary, and ends in `…` so it reads like a news summary.
5. Set the headline in a 1200×630 news-style image: the wordmark and date, the structure's section, and the headline, whose font size steps down as it gets longer. The headline is never cut, and it doubles as the image's alt text.

Every post comes from a seed. The same seed (plus the same forced structure or subject) always gives the same post.

## Where things live

| File | What's in it |
| --- | --- |
| `structures/_*.ts` | One file per headline structure, with its headline options and (optionally) its own excerpt |
| `_subjects.ts` | The things AI is about to end, with their grammar |
| `_wrappers.ts` | "the {X} Economy", "Big {X}" and friends, plus how often they show up. `allowPlural: false` keeps a wrapper off plural subjects, so nothing reads "Bowling Leagues Culture" |
| `_castPools.ts` | Fake names, titles, startups, cities, generations, timeframes, groups, products |
| `_excerpts.ts` | The generic lede, quote, background and kicker pools that structures fall back on |
| `_corpus.ts` | The index that ties it all together |

## Syntax

- A plain string is literal text: `"Is AI Quietly Killing {subject}?"`
- An array means "pick one": `["Millennials", "Gen Z"]`
- `w(option, weight)` makes an option more or less likely. Unweighted options count as 1.
- `seq(a, b, c)` joins its parts in order. Each part can be a string, an array or another `seq`.
- `lock(who, pronouns, option)` keeps an option out of the pick unless that cast member uses those pronouns: `lock("expert", "he", "Godfather of AI")`. `who` is a token prefix: `expert`, `person`, `generation.speaker` or `rival.speaker`, plus `speaker` inside generation traits and `expert` in `relatives`. A lock only works as an option in an array, it combines with `w()` in either order, and every array that locks has to leave something for he, she and they.

## Tokens

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
| `{generation}` `{rival}` | Millennials · Gen Z, with the same `.is` / `.was` / `.has` / `.s` grammar. `{rival}` is always the one who's mad |
| `{generation.venue}` `{generation.catchphrase}` `{generation.quirk}` `{generation.hypocrisy}` | Stereotypes from `_castPools.ts` (same keys on `{rival}`): "a Facebook group with 40,000 members", "Love, Mom", "who still use Facebook", and a full complaint-plus-self-own sentence. Generations take verb agreement from their name ("Gen Z Is") but always use "they" pronouns |
| `{speaker}` (inside generation traits) `{generation.speaker}` `{generation.age}` | The generation's own spokesperson, with an age from that generation's `ages` range, in a mix of formats: "Juniper Turnblatt, 29", "29-year-old Juniper Turnblatt", "Juniper Turnblatt (29)" |
| `{model}` `{model.new}` `{model.old}` | Mindloaf · Mindloaf 5 · Mindloaf 4.9 |
| `{expert}` `{expert.first}` `{expert.last}` `{expert.title}` | Brindle Thistlewick, Chief Vibes Officer |
| `{person}` `{person.first}` `{person.last}` `{person.age}` | a second fake person, for anecdotes |
| `{expert.he}` `{expert.him}` `{expert.his}` `{expert.himself}` `{expert.hes}` | he / she / they, him / her / them, his / her / their, himself / herself / themself, he's / she's / they're. The same tokens work on `{person}`, `{generation.speaker}`, `{rival.speaker}`, and `{speaker}` inside generation traits. Pronouns come from the first name |
| `{expert.is}` `{expert.isnt}` `{expert.was}` `{expert.has}` `{expert.s}` | Verbs that agree with that person's pronoun, because singular "they" takes "are": `{expert.He} {expert.is}`, `{person.he} say{person.s}`. They follow the pronoun, so after a noun ("a {person.man} who says") write the verb as plain text |
| `{expert.man}` `{expert.boy}` `{expert.boyfriend}` and friends | Gendered words from `genderedWords` in `_castPools.ts`, which describe the person themself: man / woman / person, boy / girl / kid. Someone they know stays plain text: `{expert.his} son` |
| `{relative}` | Estranged Uncle of AI. It's the expert's epithet, and the gendered ones lock to the expert's pronouns, so keep it next to `{expert}` |
| `{startup}` `{city}` `{money}` `{age}` `{percent}` | Frothr, Duluth, $40M, 19, 61. Use `{city}` in headlines and `{city.inline}` mid-sentence. They only differ for places like "the Food Court of a Dying Mall in Omaha" |
| `{timeframe}` `{group}` `{product}` | each with an `.inline` form for mid-sentence use |

**Capitalize the token to capitalize the output.** The case of the last part of the token decides it: `{subject.Is}` gives "Is" or "Are", and `{Subject}` gives "The Casserole". Use the capitalized form at the start of a headline or sentence.

**Gendered tokens are named for their "he" form.** `{expert.his}` gives "her" for a she, and `{speaker.boy}` gives "girl".

## Adding a first name

Add it to `firstNames` in `_castPools.ts` with the pronouns everyone with that name uses: `{ name: "Greg", pronouns: "he" }`. To add a gendered word, add a `[he, she, they]` line to `genderedWords`. Its "he" form becomes the token name, so it has to be plain lowercase letters.

## Adding a subject

Add it to `_subjects.ts`. Set `plural: true` for plural nouns, `activity` if it works after "Vibe-", and `inline` when lowercasing the name would mangle a proper noun (for example `"the Minnesota goodbye"`).

## Adding a structure

Create `structures/_yourStructure.ts`, export a `Structure`, and add it to `_corpus.ts`. Use `requires: ["activity"]` if it needs `{subject.activity}`. Give it a newspaper section for the headline image in `SECTIONS` in `src/ts/card/_headlineCard.ts`.

A structure brings its own excerpt with `excerptWith({ lede, quote, background, kicker })`. Any part you leave out falls back to the generic pool in `_excerpts.ts`. To mix the generic pool into your own at a lower rate, add it as one weighted option: `lede: ["your line", "another line", w(ledes, 1)]`.

When a structure has several different jokes and each headline needs its own matching excerpt, give it `variants` instead of `headline` and `excerpt`. The Study and the Market Panic work this way. Each variant has an `id`, a `label`, an optional `weight`, a `headline`, and an `excerpt`. The workbench lists each variant under its structure, so you can force one.

## What the engine and tests enforce

- **The cut.** The excerpt maxes out at 300 graphemes on its own. It's cut at a word boundary and ends in `…`, so the lede and quote show, some of the background usually does, and the kicker usually doesn't. The headline is never cut.
- **Rage-Bait's opening line.** The hypocrisy line opens the excerpt and must fit whole, even with the longest name, oldest age, and longest pronouns. The tests check that worst case directly.
- **Quote punctuation.** Periods and commas go inside closing quotes (`“like this.”`).
- **Tokens.** Every `{token}` has to resolve, and a capitalized token has to start each headline and sentence.
- **Pronouns.** A batch of posts has to render cleanly with everyone as "he", then as "she", then as "they", so a verb that ignores singular "they" ("they has") fails. A pronoun token followed by a plain-text verb ("{person.he} has", "{person.he} plans") fails too, whether or not a post happens to pick it. Every `lock()` has to be an option in an array, name someone who's in the cast there, and leave an option for each set of pronouns.
- **Real brands.** They're fine as background detail, but don't make up claims about what a real company or person does. Quoted people, experts, startups and investors are invented.
- **The headline image.** Every structure needs a section in `SECTIONS`. Every headline has to stay within `MAX_HEADLINE` (200 graphemes) and use only characters the card fonts can draw: Fontsource's Latin subset, so no emoji or letters like Ł. The coverage test checks both for every combination. `tests/card.test.ts` lays out the longest headlines and one at the cap, and reports any text that spills.
- **Run `bun run test` after editing.** The coverage test renders every structure and variant with every subject and wrapper that fits it, and it prints the exact post when something breaks.

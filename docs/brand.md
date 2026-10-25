# Brand

| Where | What's in it |
| --- | --- |
| `src/img/brand/` | The logo kit: the "upward revision" balloon chart as a symbol, wordmark and avatar, each in color, one-color and reverse |
| `src/img/favicon/` | The favicon set and webmanifest, with relative paths so they work under `/hypewire/` |
| `src/img/og-wide.png` | The site's OpenGraph image |
| `_NFW/` | Design sources that never ship with the site: the OpenGraph template, the approved headline-card mock, the Bluesky profile banner (`bluesky-banner.png`), and the GitHub repo's social preview (`OpenGraph-GitHubRepo.png`), which GitHub only takes as a manual upload in Settings |

## Colors

The palette is paper `#f6f3ea`, ink `#161616`, red `#b3121f` and rule `#d6d0c2`. The headline card keeps its own copy in `src/ts/card/_headlineCard.ts`, and the workbench's lives in `src/scss/abstracts/_variables.scss`. The workbench page itself is dark (`#1b1a18` with a faint halftone), so the paper-colored cards stand out against it.

## The wordmark on the card

The card's masthead draws the wordmark from `src/ts/card/_wordmark.ts`, which is `src/img/brand/wordmark.svg` without its `<title>`. Satori can't encode the title's em dash. If the wordmark changes, paste the new file in there. `tests/card.test.ts` fails until the two match.

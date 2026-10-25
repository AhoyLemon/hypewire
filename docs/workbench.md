# The workbench

`bun run dev` serves a local page for testing the corpus at http://localhost:3000. It's also published at https://ahoylemon.github.io/hypewire/.

The controls are pinned to the bottom-right corner. You can force a structure and/or a subject, type a seed, generate a batch of 20, and open the full excerpt from before the cut. The URL (`?seed=…&structure=…&subject=…`) reproduces whatever is on screen, which is handy when a post comes out broken or perfect.

## The headline image

Each post shows the way it'll look on Bluesky: the excerpt, then the headline image. The workbench renders the image with the same card code the post script uses, through satori and the card fonts loaded from jsDelivr. The import map that points to them is pinned to the installed satori and font versions (`scripts/_pugLocals.ts`), so the preview matches what posts. It can still differ by a hair: jsDelivr picks satori's own dependencies, and the browser draws the SVG that the post script turns into a PNG. If the CDN can't be reached, the headline shows as plain text and the page says why.

## Deploying

`.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages on every push to `main`, which needs the repo's Pages source set to GitHub Actions.

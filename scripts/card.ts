import { mkdir, rm, writeFile } from "node:fs/promises";

import chalk from "chalk";
import ora from "ora";

import {
  CARD_FORMATS,
  headlineSize,
  printDate,
  SECTIONS,
  type CardFormat,
} from "../src/ts/card/_headlineCard.js";
import { corpus } from "../src/ts/corpus/_corpus.js";
import { generate, type GeneratedPost } from "../src/ts/engine/_generate.js";
import { POST_LIMIT } from "../src/ts/engine/_truncate.js";
import { graphemeLength } from "../src/ts/lib/graphemes.js";
import { renderCard } from "./_renderCard.js";

/** Renders headline cards and a page that mocks them up as Bluesky posts. Usage: bun run card [count] */
const requested = Number.parseInt(process.argv[2] ?? "", 10);
const count = Number.isFinite(requested) && requested > 0 ? requested : 6;

const OUT = new URL("../out/cards/", import.meta.url);
const FORMATS = Object.keys(CARD_FORMATS) as CardFormat[];
const WORST_CASE_SEEDS = 5_000;

interface MockPost {
  post: GeneratedPost;
  note: string;
}

/** The longest Pull Quote headline in a sweep of seeds, since that structure runs longest. */
function worstCase(): GeneratedPost {
  let worst = generate(corpus, { seed: 1, structureId: "pullQuote" });
  for (let seed = 2; seed <= WORST_CASE_SEEDS; seed++) {
    const post = generate(corpus, { seed, structureId: "pullQuote" });
    if (graphemeLength(post.headline) > graphemeLength(worst.headline))
      worst = post;
  }
  return worst;
}

function pickPosts(): MockPost[] {
  const perStructure = corpus.structures.map((structure) => ({
    post: generate(corpus, { structureId: structure.id }),
    note: "one per structure",
  }));
  const random = Array.from({ length: count }, () => ({
    post: generate(corpus),
    note: "random",
  }));
  const longest = {
    post: worstCase(),
    note: `longest Pull Quote headline in ${WORST_CASE_SEEDS.toLocaleString()} seeds`,
  };
  return [...perStructure, ...random, longest];
}

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fileName = (index: number, format: CardFormat): string =>
  `${String(index + 1).padStart(2, "0")}-${format}.png`;

function postHtml({ post, note }: MockPost, index: number): string {
  const { seed, structureId, structureLabel, variantLabel, graphemes } =
    post.debug;
  const alt = escapeHtml(post.headline);
  const images = FORMATS.map(
    (format) =>
      `<img class="card ${format}" src="${fileName(index, format)}" alt="${alt}" width="${CARD_FORMATS[format].width}" height="${CARD_FORMATS[format].height}">`,
  ).join("\n          ");
  const variant = variantLabel ? `: ${escapeHtml(variantLabel)}` : "";
  const section = SECTIONS[structureId] ?? "News";
  const headlineLength = graphemeLength(post.headline);

  return `
    <li>
      <article class="post">
        <div class="avatar" aria-hidden="true">H</div>
        <div class="body">
          <p class="byline"><strong>Hypewire</strong> <span>@hypewire.bsky.social · 2h</span></p>
          <p class="text">${escapeHtml(post.excerpt)}</p>
          ${images}
          <p class="actions" aria-hidden="true"><span>💬 12</span><span>🔁 48</span><span>♡ 310</span></p>
        </div>
      </article>
      <p class="meta">seed ${seed} · ${escapeHtml(structureLabel)}${variant} · ${escapeHtml(section)} · text ${graphemes}/${POST_LIMIT} · headline ${headlineLength} graphemes at ${headlineSize(post.headline)}px · ${escapeHtml(note)}</p>
    </li>`;
}

function pageHtml(posts: MockPost[]): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hypewire card mockups</title>
  <style>
    :root { color-scheme: light; --ink: #0b0f14; --muted: #5b6b7b; --line: #d4dbe2; --paper: #fff; --page: #eef1f4; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px 16px 64px; background: var(--page); color: var(--ink); font: 15px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; }
    header { max-width: 600px; margin: 0 auto 24px; }
    h1 { margin: 0 0 4px; font-size: 22px; }
    header p { margin: 0 0 16px; color: var(--muted); }
    fieldset { display: inline-flex; gap: 12px; margin: 0 16px 8px 0; padding: 8px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--paper); }
    legend { padding: 0 4px; font-weight: 600; }
    label { display: inline-flex; gap: 6px; align-items: center; cursor: pointer; }
    input:focus-visible { outline: 2px solid #1f4f8f; outline-offset: 2px; }
    ol { list-style: none; margin: 0 auto; padding: 0; max-width: 600px; }
    li { margin-bottom: 24px; }
    .post { display: grid; grid-template-columns: 42px 1fr; gap: 10px; padding: 12px 16px; background: var(--paper); border: 1px solid var(--line); border-radius: 4px; }
    .avatar { width: 42px; height: 42px; border-radius: 50%; background: #161616; color: #f6f3ea; display: grid; place-items: center; font-weight: 800; }
    .body { min-width: 0; }
    .byline { margin: 0 0 2px; }
    .byline span { color: var(--muted); }
    .text { margin: 0 0 10px; white-space: pre-wrap; }
    .card { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: 12px; }
    .actions { display: flex; gap: 48px; margin: 10px 0 0; color: var(--muted); font-size: 13px; }
    .meta { max-width: 600px; margin: 6px 0 0; color: var(--muted); font-size: 12px; }
    body:has(#Wide:checked) .card.square, body:has(#Square:checked) .card.wide { display: none; }
    body:has(#Phone:checked) ol, body:has(#Phone:checked) header { max-width: 390px; }
  </style>
</head>
<body>
  <header>
    <h1>Hypewire card mockups</h1>
    <p>${posts.length} posts, rendered ${escapeHtml(printDate(new Date()))}. Excerpt as the post text, headline in the image.</p>
    <form>
      <fieldset>
        <legend>Image</legend>
        <label><input type="radio" name="format" id="Wide" checked> Wide (1.91:1)</label>
        <label><input type="radio" name="format" id="Square"> Square</label>
      </fieldset>
      <fieldset>
        <legend>Width</legend>
        <label><input type="radio" name="width" id="Phone" checked> Phone</label>
        <label><input type="radio" name="width" id="Desktop"> Desktop</label>
      </fieldset>
    </form>
  </header>
  <ol>${posts.map(postHtml).join("")}
  </ol>
</body>
</html>
`;
}

async function main(): Promise<void> {
  const posts = pickPosts();
  const total = posts.length * FORMATS.length;
  const spinner = ora(`Rendering 0/${total} cards`).start();
  const date = printDate(new Date());

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  let done = 0;
  let largest = 0;
  for (const [index, { post }] of posts.entries()) {
    for (const format of FORMATS) {
      const png = await renderCard({
        headline: post.headline,
        structureId: post.debug.structureId,
        date,
        format,
      });
      largest = Math.max(largest, png.byteLength);
      await writeFile(new URL(fileName(index, format), OUT), png);
      spinner.text = `Rendering ${++done}/${total} cards`;
    }
  }
  await writeFile(new URL("index.html", OUT), pageHtml(posts));

  spinner.succeed(
    `Rendered ${total} cards (largest ${Math.round(largest / 1000)} KB)`,
  );
  console.log(
    `  ${chalk.cyan("http://localhost:3000/out/cards/")} while ${chalk.bold("bun run dev")} is running`,
  );
}

main().catch((err) => {
  console.error("card failed:", err);
  process.exit(1);
});

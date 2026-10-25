import { appendFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

import { Agent, CredentialSession } from "@atproto/api";

import {
  CARD_HEIGHT,
  CARD_WIDTH,
  printDate,
} from "../src/ts/card/_headlineCard.js";
import { corpus } from "../src/ts/corpus/_corpus.js";
import { generate, type GeneratedPost } from "../src/ts/engine/_generate.js";
import { postUrlFromAtUri } from "../src/ts/lib/blueskyLink.js";
import { renderCard } from "./_renderCard.js";

const MAX_ATTEMPTS = 20;
const dryRun = process.argv.includes("--dry-run");

/** Writes to the GitHub Actions job summary. No-ops outside of Actions. */
function appendSummary(markdown: string): void {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  appendFileSync(summaryPath, `${markdown}\n`);
}

/** Escapes a message for use in a GitHub Actions workflow command (::notice::/::warning::). */
function escapeForWorkflowCommand(message: string): string {
  return message
    .replace(/%/g, "%25")
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A");
}

/** Retries with a fresh seed if generating ever throws. Returns null once MAX_ATTEMPTS is spent. */
function generatePost(): GeneratedPost | null {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return generate(corpus);
    } catch (err) {
      console.warn(
        `Attempt ${attempt} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }
  return null;
}

async function main(): Promise<void> {
  const post = generatePost();
  if (!post) {
    const message = `Could not generate a post within ${MAX_ATTEMPTS} attempts; skipping this run.`;
    console.warn(message);
    console.log(
      `::warning title=BlueSky: skipped::${escapeForWorkflowCommand(message)}`,
    );
    appendSummary(`## ⚠️ Skipped\n\n${message}`);
    return;
  }

  const label = `seed ${post.debug.seed} · ${post.debug.structureLabel} · ${post.debug.graphemes} graphemes`;
  const card = await renderCard({
    headline: post.headline,
    structureId: post.debug.structureId,
    date: printDate(new Date()),
  });

  if (dryRun) {
    const out = new URL("../out/", import.meta.url);
    const cardFile = new URL(`post-${post.debug.seed}.png`, out);
    await mkdir(out, { recursive: true });
    await writeFile(cardFile, card);
    console.log(
      `${label}\n\n${post.headline}\n\n${post.excerpt}\n\nImage: ${cardFile.pathname}`,
    );
    return;
  }

  const identifier = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) {
    throw new Error(
      "Missing BLUESKY_IDENTIFIER or BLUESKY_APP_PASSWORD environment variable.",
    );
  }

  const session = new CredentialSession(new URL("https://bsky.social"));
  await session.login({ identifier, password });
  const agent = new Agent(session);

  const did = session.did;
  if (!did) throw new Error("Login succeeded but no session DID was returned.");

  const upload = await agent.uploadBlob(card, { encoding: "image/png" });
  const result = await agent.post({
    text: post.excerpt,
    langs: ["en"],
    embed: {
      $type: "app.bsky.embed.images",
      images: [
        {
          image: upload.data.blob,
          // The image is the headline set in type, so its alt text is the headline word for word.
          alt: post.headline,
          aspectRatio: { width: CARD_WIDTH, height: CARD_HEIGHT },
        },
      ],
    },
  });
  const postUrl = postUrlFromAtUri(result.uri, did);
  console.log(`Posted (${label}):`, postUrl);
  console.log(
    `::notice title=BlueSky: posted::${escapeForWorkflowCommand(`Posted: ${postUrl}`)}`,
  );
  appendSummary(
    `## ✅ Posted to BlueSky\n\n**[View post](${postUrl})** · ${label}\n\n> **${post.headline}**\n>\n> ${post.excerpt}`,
  );
}

main().catch((err) => {
  console.error("post failed:", err);
  process.exit(1);
});

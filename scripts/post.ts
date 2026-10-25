import { appendFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { Agent, CredentialSession } from "@atproto/api";

import {
  CARD_HEIGHT,
  CARD_WIDTH,
  printDate,
} from "../src/ts/card/_headlineCard.js";
import { corpus } from "../src/ts/corpus/_corpus.js";
import { type GeneratedPost } from "../src/ts/engine/_generate.js";
import { postUrlFromAtUri } from "../src/ts/lib/blueskyLink.js";
import { lastStructureId, recordPostInfo, rollPost } from "./_postHistory.js";
import { renderCard } from "./_renderCard.js";

const MAX_ATTEMPTS = 20;
const SERVICE = new URL("https://bsky.social");
const dryRun = process.argv.includes("--dry-run");

const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

const structureLabel = (id: string): string =>
  corpus.structures.find((s) => s.id === id)?.label ?? id;

/** The last post's structure, read from the account without logging in, so dry runs check it too. Null when there's no identifier or the read fails, which only means no structure sits out. */
async function previousStructure(
  identifier: string | undefined,
): Promise<string | null> {
  if (!identifier) return null;
  try {
    return await lastStructureId(new Agent({ service: SERVICE }), identifier);
  } catch (err) {
    console.warn(
      "Couldn't read the last post's structure, so any structure can come up:",
      errorMessage(err),
    );
    return null;
  }
}

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

interface ReadyPost {
  post: GeneratedPost;
  /** The headline image as a PNG. */
  card: Buffer;
}

/** Retries with a fresh seed if generating or rendering the image ever throws. Returns null once MAX_ATTEMPTS is spent. */
async function generatePost(avoid: string | null): Promise<ReadyPost | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const post = rollPost(avoid);
      const card = await renderCard({
        headline: post.headline,
        structureId: post.debug.structureId,
        date: printDate(new Date()),
      });
      return { post, card };
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
  const identifier = process.env.BLUESKY_IDENTIFIER;
  const avoid = await previousStructure(identifier);
  const ready = await generatePost(avoid);
  if (!ready) {
    const message = `Could not generate a post within ${MAX_ATTEMPTS} attempts; skipping this run.`;
    console.warn(message);
    console.log(
      `::warning title=BlueSky: skipped::${escapeForWorkflowCommand(message)}`,
    );
    appendSummary(`## ⚠️ Skipped\n\n${message}`);
    return;
  }

  const { post, card } = ready;
  const label = `seed ${post.debug.seed} · ${post.debug.structureLabel} · ${post.debug.graphemes} graphemes`;
  const lastPost = avoid
    ? `The last post was ${structureLabel(avoid)}, so it sat this one out.`
    : "No structure on record for the last post, so any could come up.";

  if (dryRun) {
    const out = new URL("../out/", import.meta.url);
    const cardFile = new URL(`post-${post.debug.seed}.png`, out);
    await mkdir(out, { recursive: true });
    await writeFile(cardFile, card);
    console.log(
      `${label}\n${lastPost}\n\n${post.headline}\n\n${post.excerpt}\n\nImage: ${fileURLToPath(cardFile)}`,
    );
    return;
  }

  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) {
    throw new Error(
      "Missing BLUESKY_IDENTIFIER or BLUESKY_APP_PASSWORD environment variable.",
    );
  }

  const session = new CredentialSession(SERVICE);
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
  console.log(lastPost);
  console.log(
    `::notice title=BlueSky: posted::${escapeForWorkflowCommand(`Posted: ${postUrl}`)}`,
  );
  appendSummary(
    `## ✅ Posted to BlueSky\n\n**[View post](${postUrl})** · ${label}\n\n${lastPost}\n\n> **${post.headline}**\n>\n> ${post.excerpt.replace(/\n/g, "\n> ")}`,
  );

  // The post is already up, so a failure here only warns. The next post just won't know to skip this structure.
  try {
    await recordPostInfo(agent, did, result.uri, post);
  } catch (err) {
    const message = `Posted, but couldn't save its structure, so the next post may repeat it: ${errorMessage(err)}`;
    console.warn(message);
    console.log(
      `::warning title=BlueSky: no post info::${escapeForWorkflowCommand(message)}`,
    );
    appendSummary(`⚠️ ${message}`);
  }
}

main().catch((err) => {
  console.error("post failed:", err);
  process.exit(1);
});

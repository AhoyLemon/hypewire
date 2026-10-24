import { appendFileSync } from "node:fs";

import { Agent, CredentialSession } from "@atproto/api";

import { corpus } from "../src/ts/corpus/_corpus.js";
import { generate, type GeneratedPost } from "../src/ts/engine/_generate.js";
import { postUrlFromAtUri } from "../src/ts/lib/blueskyLink.js";

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

/** Retries with a fresh seed if a headline ever comes out too long to fit. Returns null once MAX_ATTEMPTS is spent. */
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

  if (dryRun) {
    console.log(`${label}\n\n${post.text}`);
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

  const result = await agent.post({ text: post.text });
  const postUrl = postUrlFromAtUri(result.uri, did);
  console.log(`Posted (${label}):`, postUrl);
  console.log(
    `::notice title=BlueSky: posted::${escapeForWorkflowCommand(`Posted: ${postUrl}`)}`,
  );
  appendSummary(
    `## ✅ Posted to BlueSky\n\n**[View post](${postUrl})** · ${label}\n\n> ${post.text.replace(/\n/g, "\n> ")}`,
  );
}

main().catch((err) => {
  console.error("post failed:", err);
  process.exit(1);
});

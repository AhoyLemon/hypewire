import type { Agent } from "@atproto/api";

import { corpus } from "../src/ts/corpus/_corpus.js";
import { generate, type GeneratedPost } from "../src/ts/engine/_generate.js";

/** A sidecar record saved next to each post under the post's own record key, the way Bluesky's threadgates extend posts. Bluesky apps never show it. */
export const POST_INFO = "xyz.ahoylemon.hypewire.postInfo";

/** Enough rerolls that a repeat is practically impossible, without looping forever on a one-structure corpus. */
const MAX_REROLLS = 50;

/** The structure of the bot's latest post, from its newest sidecar record. Null when there isn't one yet. */
export async function lastStructureId(
  agent: Agent,
  repo: string,
): Promise<string | null> {
  const { data } = await agent.com.atproto.repo.listRecords({
    repo,
    collection: POST_INFO,
    limit: 1,
  });
  const structure = data.records[0]?.value.structure;
  return typeof structure === "string" ? structure : null;
}

/** A post in any structure but `avoid`. It rerolls whole posts instead of steering the pick, so a post's seed alone still reproduces it in the workbench. */
export function rollPost(avoid: string | null): GeneratedPost {
  let post = generate(corpus);
  for (
    let roll = 1;
    roll < MAX_REROLLS && post.debug.structureId === avoid;
    roll++
  )
    post = generate(corpus);
  return post;
}

/** Saves which structure and seed made a post, in its sidecar record. */
export async function recordPostInfo(
  agent: Agent,
  did: string,
  postUri: string,
  post: GeneratedPost,
): Promise<void> {
  await agent.com.atproto.repo.createRecord({
    repo: did,
    collection: POST_INFO,
    rkey: postUri.split("/").pop(),
    record: {
      $type: POST_INFO,
      post: postUri,
      structure: post.debug.structureId,
      seed: post.debug.seed,
      createdAt: new Date().toISOString(),
    },
  });
}

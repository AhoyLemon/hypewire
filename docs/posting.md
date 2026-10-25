# Posting

Each post is the excerpt as text, with the headline image attached and the headline as its alt text.

## The schedule

`.github/workflows/post-bluesky.yml` posts four times a day, around the clock. Runs start at 3:23am, 9:23am, 3:23pm and 9:23pm Central (off the hour, when GitHub's scheduler is less busy), and each waits a random 0 to 59 minutes first, so a post lands somewhere in the hour after its slot and never at the same minute two days running. The cron's `timezone` key keeps the slots on Central time through daylight saving, and skipping the 2am hour means a slot is never dropped or doubled. A run GitHub drops costs that one post and nothing else.

## No repeat structures

The bot never posts the same structure twice in a row. After each post it saves a small sidecar record next to it on the account (`xyz.ahoylemon.hypewire.postInfo`, under the post's own record key), holding the post's structure and seed. Bluesky apps don't show it. Before the next post, `scripts/post.ts` reads the newest one without logging in, and rerolls with fresh seeds until it lands on a different structure, so every post's seed still reproduces it in the workbench. Dry runs check it too. If the record can't be read or written, the bot posts anyway and the next post may repeat a structure.

## Turning it on

1. Create an [app password](https://bsky.app/settings/app-passwords) for the bot's account.
2. Add the repository secrets `BLUESKY_IDENTIFIER` (`hype-wire.bsky.social`) and `BLUESKY_APP_PASSWORD`. The identifier has to be the handle, not the account's email: an email logs in fine, but the no-repeat check can't read the account with it.
3. Run the workflow by hand from the Actions tab to send a test post. Manual runs always post and skip the random wait, but one started while a scheduled run is still waiting queues behind it, since only one run posts at a time.
4. Set the repository variable `POSTING_ENABLED` to `true` to start the schedule. Set it to anything else to pause it.

Each run's job summary includes the post's seed, so you can open it in the workbench with `?seed=`.

## Posting from your laptop

Put `BLUESKY_IDENTIFIER` and `BLUESKY_APP_PASSWORD` in `.env.local` (it's gitignored), and Bun loads them automatically. Then `bun run post:bluesky` posts for real, and `bun run post:bluesky --dry-run` only prints the post and saves its image to `out/`. `POSTING_ENABLED` does nothing locally, so `--dry-run` is the only safety switch.

## The 60-day rule

GitHub turns off scheduled workflows in a public repo after 60 days without a commit. Any push resets the clock. If it does switch off, re-enable "Post to BlueSky" from the Actions tab.

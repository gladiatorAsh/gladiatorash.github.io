# Moon Golf leaderboard Worker

Takes finished rounds from `/play/`, checks each one against that day's course, and commits the
all-time board to `public/leaderboard.json` in this repo. The page reads the board live from the
Worker and falls back to the copy deployed with the site.

## What it checks

- Name: 2–16 letters, numbers, spaces, dots, dashes or underscores.
- Date: within about a day of now, so old courses can't be replayed into the board.
- Holes: exactly nine; each hole's par must match the course generated for that date; strokes 1–11
  (11 is a pick-up). The score is recomputed here, never taken from the browser.
- Each name keeps only its best round; the board keeps the top 50.
- At most 5 submissions a minute from one IP.

A determined person can still invent a plausible round, because the game runs in the browser.
These checks keep out typos, junk and impossible scores. To remove an entry, delete it from
`public/leaderboard.json` and commit.

Score commits carry `[skip ci]`, so they don't redeploy the site. The daily scheduled deploy picks up
the latest file for the static fallback.

## One-time setup (free)

1. **GitHub token.** github.com → Settings → Developer settings → Fine-grained tokens → Generate.
   Repository access: only `gladiatorAsh/gladiatorash.github.io`. Permissions: **Contents: Read and write**.
2. **Deploy the Worker** (needs a free Cloudflare account):

   ```sh
   cd workers/leaderboard
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put GITHUB_TOKEN   # paste the token
   ```

   `deploy` prints the URL, e.g. `https://moon-golf-leaderboard.<you>.workers.dev`.
3. **Point the site at it.** Repo → Settings → Secrets and variables → Actions → **Variables** →
   New repository variable `LEADERBOARD_URL` = that URL (no trailing slash). Re-run the
   "Deploy GitHub Pages" workflow.

Until step 3 is done the game works as before, without the submit box.

## Local testing

```sh
npx wrangler dev --var GITHUB_TOKEN:<token>
NEXT_PUBLIC_LEADERBOARD_URL=http://127.0.0.1:8787 pnpm build
```

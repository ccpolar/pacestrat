# Deploying to Netlify

Account-side checklist. The code is ready; you need three accounts first:
**GitHub** (you have one), **Netlify** (you have one), and a **Postgres database**
(Neon — free tier, not Netlify-specific, works the same as it would on any host).

Local dev stays on SQLite and the local `media/` folder — none of this affects
`npm run dev`.

---

## 1. Create a Postgres database (Neon)

[neon.tech](https://neon.tech) → new project → copy the **connection string**
(`postgres://user:pass@host/dbname?sslmode=require`). You'll paste this in
three places below.

## 2. Create a bucket for images (Cloudflare R2)

Uploads can't live on Netlify's filesystem — it's wiped on every deploy. R2 has
a free tier that comfortably covers this site.

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **R2** → create a bucket
   (any name, e.g. `pace-media`).
2. **R2 → Manage API Tokens → Create API Token** → permission *Object Read & Write*,
   scoped to that bucket. Copy the **Access Key ID** and **Secret Access Key** —
   the secret is shown once.
3. Your endpoint is `https://<account-id>.r2.cloudflarestorage.com` (the account
   ID is in the R2 dashboard URL, or under **R2 → Overview**).

## 3. Put the code on GitHub

```bash
git init
git add -A
git commit -m "Pace Strategies site, ready to deploy"
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

`.env`, `agency.db`, `media/`, and `.shots/*.db` are gitignored — nothing local
or secret goes with it.

## 4. Generate the database migration (run once, locally)

Payload needs its tables to exist before the first build can succeed, and it
only *auto-creates* them outside production — so the very first deploy needs a
real migration file. Point your local `.env` at the **real Neon connection
string** temporarily and run:

```bash
# .env: DATABASE_URI=<your Neon connection string>
npm run migrate:create
```

This writes a migration file under `src/migrations/` that creates every table.
**Commit it** — `git add src/migrations && git commit -m "Add initial migration"
&& git push`. Then put your local `.env` back to the SQLite line
(`DATABASE_URI=file:./agency.db`) so local dev is unaffected.

## 5. Import the repo into Netlify

Netlify → **Add new site → Import an existing project** → pick the GitHub repo.
It reads `netlify.toml` and installs the Next.js Runtime automatically —
don't change the build settings. **Don't deploy yet**; set the environment
variables first (next step), or the first build will fail with no database to
connect to.

## 6. Set environment variables

Netlify → Site configuration → **Environment variables**. Add:

| Name | Value |
| --- | --- |
| `DATABASE_URI` | your Neon connection string from Step 1 |
| `PAYLOAD_SECRET` | a long random string — generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SERVER_URL` | your site's Netlify URL, e.g. `https://pace-strategies.netlify.app` (update once you know it, then redeploy) |
| `S3_BUCKET` | the R2 bucket name from Step 2 |
| `S3_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` |
| `S3_ACCESS_KEY_ID` | from Step 2 |
| `S3_SECRET_ACCESS_KEY` | from Step 2 |
| `S3_REGION` | `auto` |

Then **Deploy site**. The build runs `npm run migrate && npm run build` (set in
`netlify.toml`) — the migration applies on every build, but after the first one
it's a no-op unless you've added a new migration since.

## 7. Load the content

The migration creates empty tables — nothing is in them yet. From your machine,
pointed at production:

```bash
# .env: DATABASE_URI=<Neon string>, plus the S3_* and PAYLOAD_SECRET values from Step 6
SEED_ADMIN_PASSWORD=<pick one> npm run seed
```

This uploads the Pace images to R2 and publishes all the content and projects,
and creates your first admin login. Set your `.env` back to SQLite afterward.

## 8. Check it

- The homepage shows Pace's content with images loading from R2.
- `/admin` logs in and lets you edit; saving updates the live site.
- Upload a test image on a project to confirm R2 works, then delete it.

---

## When you add a field or section later

Whenever you change `src/globals/` or `src/collections/` (add a field, add a
section), generate a new migration before deploying:

```bash
# .env pointed at the real Neon string
npm run migrate:create
git add src/migrations && git commit -m "..." && git push
```

The build applies it automatically. Skipping this means the new field exists in
code but not in the live database, and saving it will fail.

## Notes

- **Custom domain**: Netlify → **Domain management** → add it, then update
  `NEXT_PUBLIC_SERVER_URL` to match and redeploy.
- **Local dev is unaffected by any of this.** Without `S3_BUCKET` set, uploads
  always save to `./media`; without a `postgres://` URL, `DATABASE_URI` falls
  back to SQLite.

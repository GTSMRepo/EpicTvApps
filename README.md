# TV App Store

A tiny, static "app store" page for sideloading your own APKs onto Fire TV
Sticks, Onn boxes, and other Android TV devices via the **Downloader** app.
Hosted for free on GitHub Pages. No backend, no database — just a JSON file
and a folder of APKs.

## 1. Put this on GitHub

1. Create a new repository on GitHub (public, so Pages can serve it for free).
2. Upload everything in this folder to that repo (or `git init` / `git remote add origin ...` / `git push` from here).
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
5. GitHub gives you a URL like:
   `https://your-username.github.io/your-repo/`
   That's the address you'll type into Downloader on your TV box.

It can take 1–2 minutes for the page to go live after your first push.

## 2. Add your apps

Everything is driven by `data/apps.json`. You don't need to touch the HTML.

```json
{
  "id": "unique-id",
  "name": "My App",
  "description": "One short sentence about what it does.",
  "version": "2.3.1",
  "size": "18 MB",
  "icon": "icons/my-app.png",
  "apk": "apks/my-app.apk",
  "category": "Media"
}
```

- `id` — unique string, not shown, just keep it simple.
- `icon` — optional. Path to a square PNG/JPG (roughly 256×256 looks best).
  If you skip it, or the file 404s, the tile falls back to a plain letter badge.
- `apk` — path to the file, or a full URL (see "Hosting APKs" below).
- `category` — apps are grouped into rows by this value. Use the same string
  across apps to group them ("Media", "Utilities", "Games", etc).

Add as many objects as you want to the array in `apps.json`. Order in the file
is the order they render in.

## 3. Hosting the APK files

Two options, pick based on file size:

**Small APKs (well under 100 MB):** just drop the file in `/apks/` in this
repo and point `"apk"` at `"apks/yourfile.apk"`. GitHub Pages will serve it
directly, and Downloader can pull it straight from that URL.

**Larger APKs, or if you'd rather not bloat the repo's git history:** upload
them as assets on a [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
instead, then set `"apk"` to the release asset's direct URL (GitHub shows it
when you right-click "Copy link" on the asset after publishing the release).
Releases support files up to 2 GB and don't bloat your repo's clone size.

## 4. Update anytime

Editing `data/apps.json` (or adding/removing files in `/apks`) and pushing to
`main` updates the live site automatically — no rebuild step.

## Structure

```
index.html          — the page shell
assets/style.css     — all styling
assets/app.js        — reads apps.json and renders the grid + remote navigation
data/apps.json       — your app list — edit this
icons/               — optional app icons referenced from apps.json
apks/                — APK files referenced from apps.json
```

## Notes

- The grid is built for D-pad/remote navigation: arrow keys move focus tile
  to tile, and the focused tile gets a bright highlight so it's visible from
  a couch.
- Only share this URL with people you're comfortable installing your apps —
  there's no login or access control here. If you need that, GitHub Pages
  isn't the right host (consider a private server with basic auth instead).

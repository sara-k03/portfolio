# Your Name — Portfolio Site

A 4-page static site (Home, Programming Projects, Personal Projects, Writing) with a
modern × Indian visual theme: deep indigo background, marigold and rani-pink accents,
a hand-built rangoli/kolam SVG motif, and Yatra One + Work Sans type pairing.

No build tools required — it's plain HTML, CSS, and JS, so GitHub Pages can serve it as-is.

## File structure

```
your-repo/
├── index.html          Home
├── programming.html     Programming Projects
├── personal.html        Personal Projects
├── writing.html         Writing
├── css/
│   └── style.css
└── js/
    └── main.js
```

## 1. Customize the content

Before deploying, do a find-and-replace for these placeholders across all `.html` files:

- `Your Name` → your actual name
- `you@example.com` → your email
- `yourusername` → your GitHub/LinkedIn handles
- `<title>` and `<meta name="description">` tags → your own copy
- The placeholder project cards in `programming.html` and `personal.html`
- The placeholder essays in `writing.html`

Each project card has a `tags` div, a title, a short description, and links —
duplicate the `<div class="card">...</div>` block to add more.

## 2. Create the GitHub repository

1. Go to [github.com/new](https://github.com/new) and create a new repository.
   - **Important:** if this will be your *user* site (`https://yourusername.github.io`),
     the repo must be named exactly `yourusername.github.io`.
   - If it's a *project* site instead, name it anything (e.g. `portfolio`) — it'll be served at
     `https://yourusername.github.io/portfolio/`.
2. Don't initialize with a README (you already have files locally), or if you do, you'll just merge later.

## 3. Push the files

From the folder containing `index.html`, `css/`, `js/`, etc.:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

## 4. Enable GitHub Pages

1. In your repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Set the branch to `main` and the folder to `/ (root)`.
4. Click **Save**.
5. Wait a minute or two — GitHub will give you a URL like:
   - `https://yourusername.github.io` (user site), or
   - `https://yourusername.github.io/your-repo-name/` (project site)

## 5. (Optional) Custom domain

If you own a domain, add a `CNAME` file to the repo root containing just your domain
(e.g. `yourname.com`), then configure your DNS:
- **Apex domain** (`yourname.com`): add `A` records pointing to GitHub's IPs (see
  [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
- **Subdomain** (`www.yourname.com`): add a `CNAME` DNS record pointing to
  `yourusername.github.io`.

Then set the custom domain in **Settings → Pages → Custom domain**.

## Notes on the design

- **Palette:** deep indigo (`#171634`) base, marigold (`#F5A524`) and rani-pink (`#E1387F`)
  accents, gold hairlines (`#C9A227`), teal for tags (`#1C8C7C`). All defined as CSS custom
  properties at the top of `style.css` — change them there to re-theme the whole site.
- **Type:** Yatra One for display headings (Devanagari-influenced Latin face), Work Sans
  for body and UI text. Loaded from Google Fonts via `<link>` tags in each page's `<head>`.
- **Signature motif:** the rotating rangoli (kolam) mandala in the homepage hero, built as
  inline SVG so it stays crisp at any size. The small dot-and-line dividers between
  sections echo the same motif at a smaller scale.
- Motion respects `prefers-reduced-motion` — animations are disabled for users who've
  requested reduced motion at the OS level.
- Mobile nav collapses into a toggle menu under ~720px width.

## Adding more pages

Copy any existing page (e.g. `programming.html`), update its `<title>`, content, and
add a link to it in the `.nav-links` list in **every** HTML file so navigation stays
consistent across the site.

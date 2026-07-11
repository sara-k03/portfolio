# Sarayu Kondaveeti — Portfolio

A simple static site for GitHub Pages.

## Files
- `index.html` — homepage (name, top tabs, about-me placeholder)
- `research.html` — Research & Technical (placeholder slot)
- `writing.html` — Writing (placeholder slot)
- `personal.html` — Personal (placeholder slot)
- `styles.css` — shared styling
- `assets/mandala.svg`, `assets/leaf-divider.svg` — decorative graphics

## How to publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `your-username.github.io` for a root domain, or any name like `portfolio`).
2. Copy all the files above into the repo, keeping the `assets/` folder structure intact.
3. Commit and push to the `main` branch.
4. In the repo, go to **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Set branch to `main` and folder to `/ (root)`, then Save.
7. Your site will be live in a minute or two at the URL GitHub shows on that page.

## Editing content later
- **About Me**: open `index.html`, find the `<section class="about">` block, and replace the placeholder paragraph.
- **Each tab**: open `research.html`, `writing.html`, or `personal.html` and replace the contents inside `<div class="content-slot"> ... </div>` with your real content (text, images, links, project cards, etc.). The surrounding styling will still apply if you keep it inside `.page-wrap`.
- **Colors**: all colors are defined as CSS variables at the top of `styles.css` (`:root { ... }`) — change them once there to restyle the whole site.

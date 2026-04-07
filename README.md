# ACL 2026 Tutorial Website (GitHub Pages)

Static website for the ACL 2026 tutorial:
**Knowledge Control for Responsible Generative AI: Bridging Academia, Industry, and Society**.

## Local preview

Because the page loads `data/tutorial.json` via `fetch()`, you should preview it using a local server (not by double-clicking `index.html`).

From the repo root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Update content

- **Main content** lives in `data/tutorial.json`:
  - title + event line (San Diego, July 2; time/room placeholders)
  - presenters and headshot paths
  - agenda items + durations + per-part bullets
  - reading list grouped by part
  - materials links (slides/video/repo/colab), currently `null` → shown as **TBD**

- **Speaker photos** are in `assets/img/speakers/`.
  - The site renders photos as **square** thumbnails (`border-radius: 10px; object-fit: cover`).
  - If a photo is missing, it falls back to `assets/img/placeholder-avatar.svg`.

## Publish on GitHub Pages

1. Create a GitHub repository and push this folder contents.
2. In GitHub:
   - Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: `main` / `master` (whichever you use), folder: `/ (root)`
3. Wait for GitHub Pages to build, then open the provided site URL.

If you later add a custom domain, GitHub Pages will provide the DNS steps.

## Notes / placeholders

- **Time / room** are currently shown as **TBD**.
- **Slides / video / repo / Colab** links are placeholders until you paste the final URLs into `data/tutorial.json`.


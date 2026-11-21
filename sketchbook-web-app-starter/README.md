# Sketchbook Web App

An interactive portfolio for exploring sketches through physical-looking 3D books. Built with React, TypeScript, Vite, React Three Fiber, Drei, and GSAP. **GitHub is the source of truth for content**, with JSON and local assets deployed as static files—no CMS or live GitHub API calls required.

> **Status:** Starter scaffold, not the complete MVP. It includes a responsive 3D *gallery prototype*, three placeholder collections, a working JSON content pipeline, and a simple accessible HTML reader. The cinematic rise/open, curled page flips, and left-page detail transitions are deliberately *not* implemented yet. See [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md).

## Getting started

```bash
npm install
npm run dev
```

Build/check:

```bash
npm run typecheck
npm run build
```

## Where things live

```text
src/
  App.tsx                       Gallery + basic reader prototype
  components/GalleryCanvas.tsx Shared R3F gallery canvas + placeholder 3D books
  content.ts                    Lazy JSON fetching and published-content filtering
  types.ts                      Content interfaces
  styles.css                    Editorial UI styling
public/
  content/catalog.json         Small homepage index of published books
  content/books/*.json         Individual sketchbook + sketches
  artwork/<slug>/*.svg          Illustrative placeholders (not actual artwork)
docs/
  PROJECT_SPEC.md              Full original product specification
  IMPLEMENTATION_PLAN.md       Milestones, acceptance criteria, risks
  AGENT_PROMPTS.md             Copy-ready prompts for a coding agent
AGENTS.md                       Repository-wide coding-agent instructions
```

## How to add actual artwork

1. Add your image files under `public/artwork/<sketchbook-slug>/`.
2. Add or edit the sketchbook JSON under `public/content/books/<slug>.json`.
3. Update the corresponding summary in `public/content/catalog.json`.
4. Run `npm run build`; then commit and push to GitHub. Your deployment platform serves updated files through its CDN.
5. In the next iteration, add an image optimization script to create thumbnails, page textures and archival originals from source images.

**Important:** The sample sketchbooks and SVG images are placeholders for development, not your real artwork. The V1 data fields are designed to keep content separate from 3D implementation.

## GitHub repo setup

Create an **empty private** repository named `sketchbook-web-app` under your account, without checking “Add a README”, license or `.gitignore`. Then, from the extracted project folder:

```bash
git init -b main
git add .
git commit -m "chore: initialize sketchbook web app"
git remote add origin https://github.com/arpitsingh10c/sketchbook-web-app.git
git push -u origin main
```

## Design priorities

- Preserve a continuous 3D book experience; do not replace it with disconnected pages.
- One shared R3F canvas, with HTML/CSS for accessible UI and book-adjacent labels.
- Motion should be choreographed; always honor reduced-motion settings.
- Load only catalog + visible covers on the gallery; fetch book metadata and artwork on demand.
- Treat GPU memory and mobile performance as first-class constraints.

For the full product direction and experience states, read [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md) before changing the architecture.

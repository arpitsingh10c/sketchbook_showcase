# Sketchbook Web App

An editorial portfolio for exploring artwork through physical-looking 3D sketchbooks. The app uses React, TypeScript, Vite, React Three Fiber, Drei, and GSAP. Content stays in versioned JSON and static image assets so GitHub remains the only source of truth.

## Run locally

```bash
npm install
npm run dev
```

Verification:

```bash
npm run validate:content
npm run test:page-turns
npm run typecheck
npm run build
```

## Project structure

```text
public/
  content/
    catalog.json
    sketchbooks/
      everyday-observations.json
      architecture.json
      portraits.json
  assets/sketchbooks/<sketchbook>/
    cover.webp
    sketches/<sketch>/
      original.png
      thumbnail.webp
      page.webp
src/
  components/
    gallery/       Gallery layout and semantic labels
    book/          Reusable physical book geometry
    reader/        Accessible reader controls and notes
    scene/         Shared R3F canvas, camera, and lighting
  animation/       Transition constants and page helpers
  content/         Typed content loader and models
  state/           Explicit sketchbook interaction state
  styles/          Editorial application styles
scripts/
  optimize-images.mjs
  validate-content.mjs
```

## Add artwork

1. Generate variants from a PNG or JPEG:

   ```bash
   npm run optimize:images -- ./source.png everyday-observations new-sketch
   ```

2. Add the sketch record to `public/content/sketchbooks/<slug>.json`.
3. Update the matching `sketchCount` in the book file and `public/content/catalog.json`.
4. Run `npm run validate:content` and `npm run build` before committing.

The browser loads only the catalog initially. It fetches a sketchbook record and its interior artwork when that volume is selected.

## Current milestone

Milestone 3 adds CPU-deformed physical sheets to the existing reading composition. A detailed segmented page curls around the spine above the next visible page, supports distinct front/back images, and runs in either direction through one GSAP-driven progress value. Only current and adjacent textures stay resident, inactive pages remain the inexpensive paper block, navigation is locked during motion, and reduced-motion preferences are respected. See `docs/PHASE_3_PAGE_TURNS.md` for the page-order and deformation model.

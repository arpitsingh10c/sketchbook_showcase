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

Milestone 1 provides a reusable 3D book with separate covers, spine, paper block, a hinged front-cover group, responsive orthographic framing, soft shadows, keyboard-accessible HTML labels, and a no-WebGL fallback. The accessible reader remains intentionally simple. Continuous gallery-to-reader choreography and physically deformed page turns belong to later milestones in `docs/IMPLEMENTATION_PLAN.md`.

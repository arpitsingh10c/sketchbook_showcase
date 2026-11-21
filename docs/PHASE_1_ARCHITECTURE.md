# Phase 1 — homepage architecture

## Data flow

`public/content/catalog.json` is the lightweight source for the homepage. `src/content/loader.ts` fetches it, filters draft records, and sorts by `displayOrder`. `App.tsx` passes the resulting records to `Gallery`; no sketchbook metadata is embedded in a 3D component.

## Rendering layers

The gallery owns one React Three Fiber `Canvas` for every visible sketchbook. Inside it, `SketchbookScene` positions reusable `Sketchbook3D` instances and supplies a single camera and lighting rig. Semantic HTML buttons sit in a matching CSS grid above the canvas and own titles, descriptions, hover, focus, and keyboard input.

The scene graph for each volume is:

```text
Sketchbook3D
├── back cover
├── rounded paper block
├── page-edge details
├── hinged front-cover group
├── spine
└── top page mesh
```

## Camera and layout

`galleryCamera.ts` exports the configurable orthographic camera positions and responsive zoom limits. `galleryLayout.ts` owns column, row, stage-height, and book-position calculations. A single book centers itself; desktop uses two columns for larger catalogs; narrow screens use one column. The layout calculation is content-count agnostic and was checked with 1, 3, and 10 books.

## Performance and accessibility

- Device pixel ratio is capped at `1.5`.
- The gallery loads only catalog metadata; interior assets load after selection.
- One directional light, hemisphere fill, and a transparent shadow receiver provide inexpensive depth.
- Native HTML buttons provide tab navigation and visible focus feedback.
- Hover lift is disabled when `prefers-reduced-motion: reduce` is active.
- A CSS representation remains available if WebGL initialization fails.

## Phase boundary

The hinged cover exists structurally, but Phase 1 does not animate it. Coordinated opening, rising, and page deformation remain later phases.

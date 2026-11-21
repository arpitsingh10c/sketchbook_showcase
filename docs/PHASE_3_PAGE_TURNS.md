# Phase 3 — deformable page turns

## Architecture

`PageStack` is the reader-facing controller. It keeps one inexpensive static plane visible and reuses one detailed `DeformablePage`, hiding it while no turn is active. The rest of the book remains the existing paper block, so page count does not multiply scene geometry or materials.

Page records are content-agnostic:

```ts
interface SketchbookPage {
  id: string;
  frontImage: string;
  backImage?: string;
}
```

The app currently maps each sketch's page texture to the front and its thumbnail to the back. A future content schema can supply purpose-made reverse artwork without changing the 3D components.

## Deformation

The turning sheet is a plane subdivided into 28 columns and 4 rows. Its local origin is translated to the inner edge, so every vertex bends relative to the spine. GSAP animates a single normalized progress value and CPU code updates the small position buffer on each tick.

At progress `0`, the sheet lies on the right. At `1`, it lies on the left. The base rotation is `-PI * progress`. During the middle of the motion, a sine envelope adds:

- a progressively larger angular delay toward the free edge;
- a shallow arch across the sheet;
- a higher-order curl at the outer edge;
- a very small vertical wave to avoid a perfectly mechanical fold.

The spine vertices remain fixed, both endpoints return to flat geometry, and vertex normals are recomputed for changing highlights. Backward navigation runs the same deformation from `1` to `0`, keeping the motion and page identity coherent.

## Page order and textures

Forward navigation turns the current page above the next page, which is already visible underneath. Backward navigation turns the previous page from the left above the current page. The committed page index changes only after animation completion.

Front and back use separate one-sided materials over shared geometry. Back-face UVs are flipped once in texture space so text and artwork are not mirrored after the physical sheet reverses orientation.

Only the current, previous, and next pages own textures. When the window advances, textures that leave it are disposed. In-flight texture loads are request-token guarded so React Strict Mode or quick navigation cannot leak or overwrite a newer texture.

## Interaction and accessibility

The reader state stores the pending destination and locks input for the complete turn. This prevents stacked GSAP tweens from quick clicks. First/last page guards are shared by the UI and animation planner. Reduced-motion users get the same deterministic state change with a near-instant turn.

The right page uses the same book-local center as the opening transition, so Phase 2's world-to-screen alignment remains stable at every page index and viewport size.

## Verification

Run:

```bash
npm run test:page-turns
npm run validate:content
npm run typecheck
npm run build
```

The page test covers forward/backward order, first/last and one-page boundaries, deformation at flat/mid-turn endpoints, progress clamping, and front/back UV orientation.

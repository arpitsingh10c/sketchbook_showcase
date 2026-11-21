# Phase 2 — gallery to reader transition

## Continuity and state

The gallery canvas never unmounts during selection. Each catalog record keeps one `Sketchbook3D` instance and one outer actor group. The actor group owns whole-book position, rotation, and scale; the cover and introductory page expose independent pivot groups. The explicit state path is:

```text
gallery → opening → reading ⇄ showing-details → closing → gallery
```

`opening` and `closing` lock input. The close action reverses the original GSAP timeline, so the same object returns to the same captured grid transform.

## Timeline choreography

One configurable timeline overlaps all scene and DOM motion:

- At `0.00s`, the canvas stage expands from its measured gallery rectangle toward the viewport, gallery HTML exits, secondary books recede, and the selected actor begins rising.
- At `0.38s`, the cover begins opening around its spine pivot while the rise continues.
- At `0.88s`, the introductory page turns while the selected actor is still settling.
- At `1.26s`, a small scale correction produces the final spring-like settle.

Timings, target depth, scale occupancy, secondary-book depth, opening angles, and overshoot live in `src/animation/bookTransitions.ts`. Reduced-motion preference compresses the same timeline to an effectively immediate state change.

## Camera and world-space calculation

The orthographic camera remains stationary. `readingTransform.ts` predicts the final full-viewport orthographic zoom, then calculates visible world dimensions:

```text
visibleWorldWidth  = viewportPixelWidth  / orthographicZoom
visibleWorldHeight = viewportPixelHeight / orthographicZoom
```

The right-page scale is the smaller of its configured width and height occupancy, preserving the page aspect ratio. To keep the page centered after the book moves forward, the target is not assumed to be `(0, 0, z)`. Instead, the code intersects the camera's center ray with the configured reading-depth plane. The book copies the camera-plane rotation, making the page parallel to the image plane. The introductory sheet's leftward travel is derived from visible world width and the final book scale so it exits the reading frame.

The calculation was checked at 1440×900, 1024×768, and 390×844. In every case, the resulting right-page center projects to normalized device coordinates `(0, 0)`.

## Asset behavior

The per-book JSON and first page texture load after selection. Texture loading updates the existing page material and disposes the texture when it is replaced or unmounted; it does not replace the book actor.

## Phase boundary

The introductory page is still a rigid double-sided sheet. Segmented bending and curl deformation remain Phase 3 work.

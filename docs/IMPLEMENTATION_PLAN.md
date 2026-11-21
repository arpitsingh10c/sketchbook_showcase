# Sketchbook Web App — incremental build plan

## Baseline (included)

- [x] React / TypeScript / Vite scaffold
- [x] R3F shared gallery canvas with stylized 3D book placeholders
- [x] Small catalog + per-book JSON, fetched separately
- [x] Three example sketchbooks with SVG placeholders (not original artwork)
- [x] HTML prototype for forward/back navigation and details
- [x] Responsive layout, keyboard-friendly native controls

## Milestone 1 — shared book model and scene framing

- [x] Replace placeholder books with reusable `Sketchbook3D` component (spine, cover, paper block, hinged cover).
- [x] Keep 3D geometry independent from content records and layout.
- [x] Add configurable orthographic gallery camera, hover/focus affordance, soft shadows and lighting.
- [x] Preserve a single canvas for gallery/reading; test 1, 3 and 10 books.
- [x] Test that gallery labels remain HTML and align with objects across resize.

Acceptance: books have tangible cover thickness, spine, shadows; no clipped objects or overlapping labels on common laptop/mobile sizes.

## Milestone 2 — continuous gallery → reading transition

- [x] Implement explicit states: `gallery`, `opening`, `reading`, `showing-details`, `closing`.
- [x] Track selected ID, current sketch index, previous gallery transform, and input lock.
- [x] GSAP sequence: labels slide away; book rises, rotates, approaches; cover starts to open before rise finishes; first page turns; reading view settles with subtle overshoot.
- [x] Keep the camera fixed initially; drive book transforms instead.
- [x] Right page is viewport focal point, left page normally offscreen.
- [x] Reverse choreography returns same book to its original gallery slot.

Acceptance: no visible geometry swap between views; no hard jump during selection or closing; repeated clicks cannot break state.

## Milestone 3 — physical page-turn prototype

- [ ] Build a page mesh with multiple segments and double-sided texture support.
- [ ] Add realistic bending/curl deformation around the spine and positive/negative turns.
- [ ] Load only current, next and previous textures; manage ownership/disposal.
- [ ] Show artwork on the right-hand page and intro page at start of book.
- [ ] Add next/previous controls and end-of-book guards.

Acceptance: paper curls rather than rigidly swinging; reverse page motion works; imagery doesn't mirror unexpectedly.

## Milestone 4 — matching left-page details

- [ ] Print artwork notes/thumbnail as texture on reverse page while turning.
- [ ] On info click, translate book to center the left page.
- [ ] Once at rest, overlay visually aligned semantic HTML; transition should be seamless.
- [ ] Return to right-hand artwork page without full canvas remount.

Acceptance: text is crisp/selectable/readable; screen reader reaches information; page semantics remain coherent during motion.

## Milestone 5 — content pipeline and launch readiness

- [ ] Build image-derivative generation: thumbnail, cover, texture, high-res, archived original.
- [ ] Add JSON schema validation and content reference checks in CI.
- [ ] Tune loading: cover first, chosen book on selection, adjacent page preload.
- [ ] Add touch navigation, loading feedback, WebGL fallback, reduced-motion alternative.
- [ ] Profile FPS/texture memory and test mobile device pixel ratio caps.
- [ ] Deploy to Vercel/Netlify and enable static asset caching.

Acceptance: add a sketchbook by committing only JSON/assets, with zero changes to the 3D rendering source.

## Risk register

1. **Page deformation** is the largest technical risk. Validate with one page before content system integration.
2. **HTML–3D alignment** varies with responsive camera projection; formalize world/screen coordinate mapping.
3. **GPU memory** may balloon if all sketches are textured at once. Limit near-page assets and release unused textures.
4. **Motion and accessibility** require a reduced-motion path and interaction lock to prevent state conflicts.
5. **Texture text sharpness** conflicts with accessibility; render notes texture only in motion, HTML when stationary.

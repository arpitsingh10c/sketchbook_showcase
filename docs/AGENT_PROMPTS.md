# Prompts to use with your coding agent

## Prompt 1 — architecture + first milestone (recommended starting point)

Read `AGENTS.md`, `docs/PROJECT_SPEC.md`, `docs/IMPLEMENTATION_PLAN.md`, and the existing code. Treat the spec as the product source of truth. Start with **milestone 1** only. First summarize the scene graph, data flow, animation state model, camera choice, DOM/R3F layering, loading strategy, and risks. Then implement a reusable high-quality 3D sketchbook component with a visible spine, cover thickness, page block, configurable cover color, soft lighting and shadows, and responsive gallery positioning. Keep metadata in JSON and labels in HTML; reuse the shared canvas. Do not begin the cinematic opening or realistic page turning in this milestone. Run typecheck and build, and explain what remains unfinished.

## Prompt 2 — gallery-to-reader animation

Using the existing code and product spec, implement milestone 2. One selected book must rise from its current grid position, rotate to nearly front-facing, open its cover during the rise, begin the first interior page turn, and settle with the right page filling most of the viewport. Use an explicit state machine and one coordinated GSAP timeline for 3D and DOM, including interruption protection. Reverse the same sequence on close without page reload. Do not fake continuity by unmounting the object mid-transition. Account for reduced-motion behavior. Run typecheck and build.

## Prompt 3 — deformable paper prototype

Implement milestone 3 with one book and a short sample collection first. Build a segmented page mesh with realistic curling and visible front/back materials while turning around the spine. Add forward/back controls, page bounds, and a robust animation lock. Load only current/nearby assets from JSON paths and handle texture disposal. Preserve smooth motion and right-page framing. Profile interaction performance. Run typecheck and build.

## Prompt 4 — details on the left page

Implement milestone 4. Keep the artwork on the right page. When the visitor clicks info, move the book horizontally to reveal its matching left-hand description page. During the 3D turn use a pre-rendered text texture; when stationary use aligned semantic HTML/CSS with sharp typography, keyboard access and a close action. This is not a modal. Make the texture-to-HTML handoff visually continuous. Run typecheck and build.

## Prompt 5 — agent-friendly content additions

Implement milestone 5's content pipeline. Build a script that accepts source PNG/JPEG artwork and a small metadata form or JSON input, generates optimized derivatives, updates per-book JSON and catalog summary, verifies IDs/order/paths, and produces a small readable Git diff. No CMS, external database, or browser-side GitHub API. Add a validation command and GitHub Actions CI for the validation/build. Keep deployment static/CDN-based. Run typecheck and build.

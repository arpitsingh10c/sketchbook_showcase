# Instructions for coding agents

You are building **Sketchbook Web App**, an editorial interactive sketchbook portfolio. Begin with `docs/PROJECT_SPEC.md` as the source of product truth and `docs/IMPLEMENTATION_PLAN.md` for work order.

## Non-negotiables

- Use React + TypeScript + Vite; use React Three Fiber/Three.js for physical 3D book components and GSAP for coordinated UI/scene transitions.
- Keep one shared canvas for gallery and reading whenever feasible. HTML/CSS owns navigation, typography, metadata, and focused detail content.
- GitHub is the only source of content truth for V1. Keep small catalog JSON, per-book JSON, and static artwork assets. **Do not introduce a CMS, backend database, or runtime calls to GitHub APIs.**
- Data must support arbitrary books and sketches, stable IDs, explicit order and published/draft status. Never hardcode book arrays inside rendering components.
- Page turns should eventually deform and reveal both faces of a sheet. Do not use a flat card flip as the final interaction.
- Lazy-load interior assets; preload adjacent pages; dispose textures appropriately. Keep web experience usable on mobile and keyboard, including `prefers-reduced-motion`.
- Protect transitions from double-clicks/overlapping input and implement loading/error states.
- Keep changes incremental and verifiable. Run `npm run typecheck` and `npm run build` after each milestone.

## Current state

Scaffolded React app: responsive 3D gallery with simple placeholder book meshes, three sample sketchbook JSON files and placeholder SVG art. Basic reader uses HTML/CSS only. **This is explicitly not a finished interaction.** Build the 3D reading state and transition system in small milestones, beginning with one book and one page.

## First task

Implement milestone 1 in `docs/IMPLEMENTATION_PLAN.md`. Before coding, provide a short plan: proposed 3D book scene graph, interaction state machine, camera/framing assumptions, and performance constraints. Then implement, verify and describe tradeoffs.

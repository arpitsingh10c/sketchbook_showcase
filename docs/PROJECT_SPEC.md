# Sketchbook Web App
**Project specification — Version 1.0**

## 1. Project vision

Sketchbook Web App is an interactive web-based portfolio that allows visitors to explore a personal collection of sketches through realistic, three-dimensional sketchbooks.

Rather than displaying artwork in a traditional grid of images, the website presents a collection of physical-looking sketchbooks. Visitors can select a book, watch it rise from the gallery and open toward them, flip through its pages, and discover the stories behind individual sketches.

The experience should combine the tactile qualities of a physical sketchbook with the responsiveness and clarity of a modern web application.

### Core experience principles

- **Tactile:** Books should have convincing physical weight, paper thickness, subtle shadows, and realistic page-turning motion.
- **Cinematic:** Transitions should feel carefully choreographed, with overlapping animations and natural spring-like movement.
- **Minimal:** The interface should remain visually restrained, allowing the artwork and interactions to take center stage.
- **Performant:** Use 3D rendering only where it adds meaningful value.
- **Content-driven:** The app must support any number of sketchbooks and sketches without changing the 3D implementation.
- **Maintainable:** Artwork and metadata should be managed through GitHub, with an AI agent capable of adding and organizing content.

## 2. Primary user experience

### Experience A — The homepage

The homepage presents a gallery of sketchbooks arranged in a responsive grid.

On desktop, the initial layout should have two columns, with the ability to accommodate additional books across multiple rows.

Each sketchbook appears as a three-dimensional physical object with a textured cover, visible thickness, and subtle realistic lighting.

Each book also has accompanying interface elements:

- Sketchbook title
- Short description
- Optional category, date, or collection metadata
- Interaction affordance for opening the book

The book itself is rendered using Three.js. Text, metadata, and other interface elements are rendered using HTML and CSS.

A shared Three.js canvas renders the book objects within the gallery, while HTML elements align with the corresponding book positions.

The homepage camera looks down at the collection from a slightly oblique angle, approximately 60–80 degrees above the horizontal plane. The starting camera angle should be configurable.

The interface should look editorial, spacious, and intentional rather than resembling a gaming environment.

### Experience B — Selecting a sketchbook

When a visitor selects a book, the application performs a continuous transition from the gallery into the reading experience.

**Phase 1: Selection**

The selected book becomes the visual focal point. Other books remain in the background and become less prominent.

Surrounding HTML interface elements slide out of the viewport, with subtle fading where appropriate.

**Phase 2: Rising**

The selected book rises from its resting position and moves toward the camera.

As it rises, it rotates so its front cover gradually becomes perpendicular to the camera's viewing direction.

The book should feel as though it is physically floating upward rather than simply scaling into a larger image.

**Phase 3: Opening**

While the book continues rising, its front cover begins opening from right to left around the spine.

The opening motion should overlap with the rising animation rather than waiting for the previous animation to finish.

**Phase 4: First page turn**

Once the cover has sufficiently opened, the first interior page flips from right to left.

The first artwork is presented on the following right-hand page, treating the initial interior page as an introductory page.

**Phase 5: Settling into reading mode**

The book settles into a near-front-facing position, with a subtle overshoot and spring-like correction.

The camera remains stationary where practical; the book's parent transform controls the transition.

The book is positioned so that the **right-hand page fills most of the viewport**, while the left-hand page sits outside the visible area.

The motion should feel continuous, with no obvious switch between gallery and reading modes.

### Experience C — Exploring sketches

The visitor can navigate forward and backward through the sketchbook.

Each sketch appears on the right-hand page as an image texture applied to a 3D page mesh.

When moving forward:

1. The current right-hand page lifts from its outside edge.
2. The page bends and curls realistically as it rotates around the spine.
3. Its reverse face becomes visible during the turn.
4. The turning page moves toward the left side of the book.
5. The next right-hand page becomes visible underneath.
6. The camera remains focused on the right-hand page.

Page animations must preserve the impression of physical paper rather than behaving like flat cards rotating around a central axis.

Each page should have front and back surfaces, with appropriate materials and imagery.

Navigation must also support reverse page turns, returning to previous sketches.

### Experience D — Viewing sketch details

Each sketch has an associated description page occupying the corresponding left-hand page of the book.

During normal browsing, the left page is positioned outside the viewport. The right-hand artwork remains the focus.

An information control allows the visitor to explore the left page.

When activated:

1. The book translates horizontally so the left-hand page becomes centered in the viewport.
2. The movement resembles sliding across an open physical sketchbook.
3. The left page contains the artwork title, description, and a small thumbnail of the corresponding sketch.
4. The visitor can return to the artwork using a clearly visible control.

Use a **hybrid rendering approach** for the description page.

During 3D page turns, the page displays a texture containing a rendered representation of its text and layout.

Once the description page is stationary and in focus, display an aligned HTML/CSS version for sharp typography, accessible text, and interactive controls.

The transition between the texture and HTML representation should be visually seamless.

The description is the reverse-side content associated with the current artwork page, not an unrelated modal.

### Experience E — Returning to the gallery

Visitors can close a sketchbook and return to the gallery.

The book should close and return to its original grid position through a reverse, choreographed animation.

The surrounding HTML interface elements should slide back into their original positions.

The application should restore the gallery's layout without a page refresh.

## 3. Technical architecture

### Framework

Use React and TypeScript with Vite.

### Three-dimensional rendering

Use Three.js through React Three Fiber to manage 3D scenes within React.

Use Drei for useful scene helpers where appropriate.

Three.js is responsible for:

- 3D book and page geometry
- Book materials and textures
- Camera configuration
- Lighting and shadows
- Cover-opening animation
- Deformable page-turning geometry
- Book positioning, rotation, and scale

### Standard web UI

Use HTML and CSS for:

- Gallery titles and descriptions
- Navigation controls
- Page indicators
- Loading feedback
- Responsive layouts
- Accessible information panels
- Detailed artwork descriptions and interactive text

Avoid rendering standard application UI as 3D geometry unless it is physically part of an animated page.

### Animation system

Use GSAP for sequencing gallery-to-book transitions, HTML slide-out animations, and book transform animations.

Use React Three Fiber's animation loop or shader-driven deformation for animated page geometry.

Spring-like easing may be used for the book's final settling motion.

Maintain a single coordinated transition state so animations do not conflict.

### State management

Represent the primary application states explicitly:

- `gallery`
- `opening`
- `reading`
- `showing-details`
- `closing`

Track:

- Active sketchbook ID
- Active sketch index
- Whether the description is open
- Whether a page flip is in progress
- Asset loading status
- The previous gallery position of the active book

Prevent conflicting navigation and repeated input during critical transitions.

## 4. Rendering and layering

Use one shared Three.js canvas for the gallery and reading experience, where feasible.

The canvas should use a transparent background so the site's CSS background remains visible.

Use CSS positioning and transforms to align HTML labels and controls with the corresponding 3D books.

The rendered book should appear to occupy the same visual space as its associated HTML content.

During transitions, animate the 3D objects and HTML interface through one coordinated timeline.

Establish a clear stacking system:

1. CSS background and decorative elements
2. Three.js canvas containing the sketchbooks
3. HTML gallery labels and interactive controls
4. Active reading controls and aligned description content
5. Loading, error, and accessibility overlays

Three.js materials control the appearance of the books, including cover colors, paper texture, roughness, and shading.

HTML and CSS retain responsibility for the typography, colors, and interaction states of standard interface elements.

## 5. Camera and lighting

### Gallery camera

Begin with a camera elevated above the book collection, looking downward at a moderately steep angle.

Use an orthographic camera initially to create a refined, consistent gallery composition.

The books should retain enough visible perspective through their geometry and orientation to communicate depth and thickness.

### Reading composition

Transition the selected book toward a plane parallel with the camera's image plane.

Center the right-hand page rather than the entire open book.

Maintain sufficient margin around the page where possible.

The first implementation may use a stationary orthographic camera with book position, rotation, and scale animations.

If the desired sense of physical approach requires stronger perspective, experiment with a perspective camera while preserving consistent framing.

### Lighting

Start with a simple lighting setup:

- One broad, soft key light
- Subtle ambient or hemisphere fill lighting
- Soft contact shadows or a lightweight shadow approximation

Avoid expensive dynamic shadows, multiple shadow-casting lights, and unnecessary post-processing.

The aesthetic should resemble a carefully photographed physical sketchbook.

## 6. Content and storage

GitHub is the source of truth for all content.

No CMS or traditional database is required for the initial version.

Content must remain separate from the 3D rendering implementation.

### Data model

**Sketchbook**

- Unique ID
- URL-friendly slug
- Title
- Description
- Cover image reference
- Cover color/material configuration
- Created date
- Display order
- Publication status
- Associated sketches

**Sketch**

- Unique ID
- Parent sketchbook ID
- Title
- Description
- Artwork image reference
- Thumbnail reference
- Optimized page texture reference
- Original image reference
- Creation date
- Display order
- Optional tags
- Publication status

Use unique IDs and explicit relationships so content can later be migrated to a database or CMS without changing the rendering system.

### Content organization

Maintain:

- A lightweight master catalog containing sketchbook summaries
- A separate JSON file for each sketchbook containing its sketches
- Individual asset directories for artwork
- Generated image variants for different viewing sizes

The homepage should not load the metadata and images of every sketch.

### Content updates

A coding agent should be able to:

1. Add new sketchbook directories.
2. Import new PNG artwork.
3. Generate optimized image variants.
4. Create or update JSON metadata.
5. Validate references and ordering.
6. Commit the changes to GitHub.

The deployment pipeline publishes the updated static content.

## 7. Asset loading and performance

Performance is a first-class requirement.

### Initial loading

Load only the information necessary to render the gallery.

Download visible cover textures first.

Defer interior artwork loading until a book is opened or is likely to be opened.

### Sketchbook loading

When a book is selected:

- Fetch that book's JSON metadata.
- Load the artwork textures needed for the initial reading state.
- Preload nearby pages.
- Allow other images to load progressively.

### Image optimization

Retain original artwork files for archival purposes.

Generate optimized derivatives for:

- Gallery thumbnails
- Sketchbook covers
- 3D artwork pages
- High-resolution artwork inspection

Prefer browser-supported compressed image formats where they provide useful savings.

Ensure texture dimensions and memory use are appropriate for the target devices.

### GPU performance

Use the smallest practical number of active, highly detailed page meshes.

Reuse book and page geometry where possible.

Avoid mounting every sketch from every book simultaneously.

Dispose of unused GPU textures and materials safely, while retaining shared assets still in use.

Reduce animation workload when no motion is occurring.

Limit device pixel ratio where necessary.

Provide a lower-complexity mode for less powerful devices.

### Delivery

Host the website using a static hosting service such as Vercel or Netlify.

Serve JSON and image assets through the deployed site's CDN instead of making runtime requests to GitHub's API.

The application should operate without a custom server in its initial version.

## 8. Responsive behavior

Desktop is the primary reference experience, but the application must remain usable on mobile.

The gallery should use a responsive layout.

The 3D book and reading camera framing must adapt to viewport dimensions.

On smaller screens, prioritize visibility of the artwork over showing the entire physical book.

Touch navigation should be supported, including clear controls for changing pages and opening descriptions.

Provide accessible alternatives for reduced-motion preferences, keyboard navigation, and essential content.

## 9. Visual direction

The visual language should combine:

- Editorial portfolio design
- Physical stationery and sketchbook materials
- Subtle, realistic 3D lighting
- Deliberate whitespace
- Refined typography
- Carefully controlled micro-interactions

Avoid excessive visual effects.

The physical book should be the primary interaction and visual centerpiece.

Motion should communicate selection, depth, continuity, and page progression.

## 10. MVP scope

The first functional milestone should include:

- A working responsive gallery
- Three sample sketchbooks, with support for an arbitrary number
- 3D book covers and page geometry
- Book selection and rising animation
- Cover-opening animation
- Initial page-turn animation
- Forward and backward page navigation
- Right-page-focused reading view
- Left-page description navigation
- GitHub-based JSON content structure
- Progressive image loading
- Return-to-gallery transition
- Basic keyboard and touch interactions

The system should be built incrementally, with the visual and animation systems validated before adding large quantities of content.

## 11. Definition of success

The project is successful when a visitor can move naturally from the sketchbook gallery into an individual sketch, explore multiple pages, read information about an artwork, and return to the gallery without feeling that they are navigating between disconnected interfaces.

It should feel like manipulating a physical sketchbook inside a beautifully designed web application, while remaining fast, accessible, and easy to update.

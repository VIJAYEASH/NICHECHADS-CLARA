# CLARA Cybercore Design Direction

## Three stylistic approaches

### Theme Name: Signal Cathedral
Very dark cybercore with luminous cyan instrumentation, sharp editorial spacing, and an almost architectural sense of threat-monitoring ritual.
Probability: 0.06

### Theme Name: Chromatic Glass Lab
A more colorful glassmorphism system using translucent panels, prismatic refractions, and playful pop transitions that make the security dashboard feel tactile and alive.
Probability: 0.03

### Theme Name: Infrared Terminal
A severe surveillance interface built around charcoal surfaces, infrared red status states, monospaced labels, and utilitarian command-center density.
Probability: 0.08

## Chosen approach: Signal Cathedral

### Design Movement
Neo-brutalist cybercore fused with liquid-glass interface design and editorial art direction from experimental motion graphics.

### Core Principles
1. Treat every panel as a physical layer: translucent, beveled, edge-lit, and slightly lifted from the field.
2. Use asymmetry and visible system scaffolding instead of a centered marketing layout.
3. Let cyan carry trust and detection, while magenta marks anomaly, motion, and attention.
4. Keep content legible and operational underneath the spectacle; effects must clarify hierarchy rather than obscure it.

### Color Philosophy
The base is near-black graphite so luminous accents feel like real instrumentation rather than decoration. Electric cyan signals validated telemetry and active scanning; ultraviolet magenta marks volatile transitions; acidic green is reserved for healthy states; amber and red are reserved for risk. The emotional intent is vigilant, precise, and slightly uncanny.

### Layout Paradigm
A split-field command surface: fixed atmospheric layers behind a narrow top console, an offset hero field, a staggered metrics rail, and a two-column operational workspace. Cards should not all share the same width or visual weight. Key controls sit close to the content they affect, with secondary modules acting like floating glass instrument trays.

### Signature Elements
- A cyan-magenta spectral edge that travels across glass surfaces on hover.
- A cursor-reactive scan aura and drifting telemetry particles behind the dashboard.
- Beveled status chips, orbital rings, and clipped corner details that make the interface feel engineered rather than rounded by default.

### Interaction Philosophy
Interactions should feel like touching a responsive instrument. Hover introduces tilt and edge light; clicks create a contained ripple and a short pop; toggles produce a tactile snap; drawers arrive from the physical edge of the screen. High-frequency interactions remain quick and restrained, while rare actions such as running a scan can briefly heighten the visual intensity.

### Animation
Use GPU-friendly transform and opacity motion with strong custom easings. Entrance sequences stagger 40–70ms per cluster and use a small overshoot rather than a dramatic bounce. Cards float by 2–4px on hover, rotate no more than 2 degrees, and return smoothly. Ambient effects stay slow and low contrast. Respect prefers-reduced-motion by reducing parallax, particle drift, scanline movement, and pop overshoot.

### Typography System
Display: Space Grotesk, 600–700, tight tracking for CLARA and major readouts. Utility: IBM Plex Mono, 400–600, uppercase labels, timestamps, metadata, and system messages. Body: Space Grotesk at 15–17px with generous line-height. Hierarchy is established through scale, weight, and tracking rather than many colors.

### Brand Essence
CLARA is a link and QR threat-intelligence console for people who need signal before consequence; it is different because it makes risk feel observable, not abstract.
Personality: vigilant, lucid, engineered.

### Brand Voice
Headlines are short, exact, and slightly cinematic. CTAs sound like operational commands, not generic marketing. Microcopy is calm even when the signal is severe.
Example lines: “See the payload before it lands.” “Run a live perimeter scan.”

### Wordmark & Logo
A custom CLARA mark built from a split diamond and two offset radar arcs, rendered as a bright cyan symbol without text. The wordmark uses tracked Space Grotesk with a narrow spectral underline.

### Signature Brand Color
Signal Cyan: #5BF3FF — a near-white electric cyan that owns the active, trusted state of the CLARA system.

## Style Decisions
- Favor asymmetrical dashboard composition over centered landing-page symmetry.
- Use glass, glow, grain, scanlines, and particles as layered atmosphere, not as a substitute for hierarchy.
- Keep motion expressive but operational: quick state changes, slow ambient drift, and restrained parallax.
- Use Space Grotesk plus IBM Plex Mono; do not introduce Inter.

## Style Decisions

- The CLARA logo must always use the split-diamond plus offset radar-arc symbol, paired with a tracked Space Grotesk wordmark and a narrow cyan/magenta spectral underline.
- Ultraviolet magenta is reserved for anomaly, volatility, scan interference, or spectral edge motion; cyan remains the trusted active state and must visually dominate.
- Authentication and dashboard controls should read as tactile command instruments, using beveled glass, clipped corners, edge light, and mono status language rather than generic SaaS form styling.
- Add visible engineered scaffolding: rails, targeting arcs, clipped-corner frames, telemetry bands, and asymmetric instrument layers.
- Keep action language operational: prefer resume/provision/arm/inspect language over generic sign-in/create-account phrasing.

# Design System Specification: Kinetic Nebula

## 1. Overview & Creative North Star
**Creative North Star: "The Celestial Observer"**

This design system transcends traditional financial interfaces by treating data not as static numbers, but as kinetic energy suspended in a cosmic void. We are moving away from the "Dashboard Grid" and toward a "Nebular Narrative." The goal is to create a high-end, editorial trading experience where depth is infinite and focus is achieved through light and atmospheric density rather than rigid containment.

The system breaks the "template" look through **Intentional Asymmetry** (using wide margins and off-center focal points) and **Luminous Layering**. By overlapping frosted surfaces and using wide-scale typography, we evoke the feeling of a sophisticated interstellar terminal—authoritative, futuristic, and deeply immersive.

---

## 2. Colors & Atmospheric Depth
Our palette is a study of high-contrast luminosity against a near-infinite dark.

### The Palette (Material Design Tokens)
- **Background & Surfaces:**
  - `surface` / `background`: `#0b0e15` (The Deep Void)
  - `surface_container_low`: `#10131b` (Atmospheric Dust)
  - `surface_container_high`: `#1c1f28` (Nebular Core)
- **Primary & Secondary (Action & Identity):**
  - `primary`: `#85adff` | `primary_container`: `#6d9fff` (Vibrant Blue/Purple shifts)
  - `secondary`: `#b486ff` | `secondary_container`: `#6801d1` (Hyper-space Violet)
- **Accents (High-Octane Data):**
  - `tertiary`: `#b6ffed` | `tertiary_container`: `#26fedc` (Neon Cyan/Crab Nebula highlights)
  - `error`: `#ff6e84` (Supernova Red)

### Core Visual Principles
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through tonal shifts between `surface_container` levels. For example, a "Trade Detail" section should be a `surface_container_low` block sitting directly on the `background`, separated by space, not lines.
*   **Surface Hierarchy:** Use nested tiers to define importance. The most critical data (Current P&L) should live on the `surface_container_highest`, while background navigation resides on `surface_container_lowest`.
*   **The Glass & Gradient Rule:** Floating panels (Modals, Hover states) must use **Glassmorphism**. Apply `surface_variant` at 40% opacity with a `backdrop-filter: blur(20px)`. 
*   **Signature Textures:** For primary CTAs or high-level summaries, use a linear gradient: `primary` to `secondary` at a 135° angle. This adds a sense of kinetic movement.

---

## 3. Typography
We utilize a dual-typeface system to balance technical precision with high-tech personality.

*   **Display & Headlines (`Space Grotesk`):** This is our "High-Tech" voice. Use `display-lg` (3.5rem) for major financial milestones or daily totals. The wide apertures and geometric shapes feel like a digital readout.
*   **Body & Titles (`Manrope`):** Our "Clean Professional" voice. Used for trade notes, settings, and general UI. It provides high legibility at smaller scales.

**Editorial Tip:** Don't be afraid of extreme scale. A `display-lg` price label next to a `label-sm` timestamp creates a sophisticated, asymmetric hierarchy that feels custom-built.

---

## 4. Elevation & Depth
In this design system, depth is "Atmospheric" rather than "Physical."

*   **The Layering Principle:** Stacking surfaces creates the UI. A `surface_container_highest` card on a `surface_container_low` section creates a soft, natural lift.
*   **Ambient Shadows:** When an element must float (e.g., a dropdown), use a shadow tinted with `surface_tint`. 
    *   *Spec:* `box-shadow: 0 20px 40px rgba(133, 173, 255, 0.08);`
*   **The "Ghost Border" Fallback:** If a container needs more definition, use the `outline_variant` at **15% opacity**. This creates a hint of a boundary without closing off the cosmic "breathability" of the layout.
*   **Active States (The Nebula Glow):** Active elements (selected tabs, focused inputs) should feature a subtle outer glow: `0 0 15px rgba(38, 254, 220, 0.3)`.

---

## 5. Components

### Buttons
*   **Primary:** Gradient (`primary` to `secondary`), `rounded-md`. No border.
*   **Secondary:** Glass-effect (`surface_variant` @ 20% opacity), `rounded-md`, with a `Ghost Border`.
*   **States:** On hover, increase `backdrop-blur` and add a `tertiary` (Cyan) outer glow.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate list items. Use vertical padding and alternating `surface_container` subtle shifts if necessary.
*   **Trading Rows:** Use a "Hover-Lift" interaction. When a user hovers over a trade entry, change the background from `transparent` to `surface_container_high` and apply `rounded-sm`.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use `surface_container_low` with a `rounded-sm`.
*   **Active State:** The border transitions from `outline_variant` (20%) to a solid `primary` with a soft glow.

### New Signature Component: The "Nebula Pulse"
*   **Pulse Indicator:** For "Live" trading status, use a small `tertiary` dot with a repeating scale animation and a soft blur to simulate a pulsing star.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Negative Space:** Allow large sections of the `#0b0e15` background to breathe. It mimics the vastness of space.
*   **Use Subtle Animation:** Fade-ins should be soft (300ms, ease-out) and include a slight vertical slide (4px).
*   **Typography Over Icons:** Favor high-contrast typography (`display-sm`) over generic icons for major data points.

### Don't:
*   **Don't use pure white (#FFFFFF):** Always use `on_surface` (#e7e7f1) to avoid harsh optical vibration against the dark background.
*   **Don't use 100% Opaque Borders:** This shatters the "Nebula" illusion. Everything should feel semi-permeable.
*   **Don't Over-Saturate:** Keep neon accents (`tertiary`, `error`) for data-specific signals only. The majority of the UI should remain in the deep blue/purple tonal range.
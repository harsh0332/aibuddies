# Motion & Animation Spec - AI Buddies

This document logs all the motion configurations, knobs, easing functions, and performance setups used to build the AI Buddies marketing landing page.

---

## 1. 3D Hero Particle Sphere Canvas
Located in: `src/components/sections/hero-canvas.tsx`

The Hero section renders a Fibonacci-distributed particle sphere that rotates, tilts, and repels particles near the cursor. The following Named Constants are exposed at the top of the component for easy tuning:

```typescript
export const PARTICLE_COUNT = 5000;    // Number of points distributed on the sphere
export const SPHERE_RADIUS = 2;        // 3D radius scale of the sphere
export const PARTICLE_COLOR = "#8b7fff"; // Signature purple-blue color hex
export const PARTICLE_SIZE = 0.025;    // Points size rendering attribute
export const REPEL_RADIUS = 1.2;       // Distance radius from mouse in local coordinate space to trigger repel
export const REPEL_FORCE = 0.6;        // Push multiplier away from the cursor
export const RETURN_LERP = 0.08;       // Return speed factor (linear interpolation) back to original grid positions
export const ROTATION_SPEED = 0.1;     // Y-axis Y rotation multiplier
```

### Interactions
- **Auto-Rotation**: Per frame Y-axis rotation increment: `delta * ROTATION_SPEED`.
- **Tilting**: Tilts points group toward the cursor using a dampening lerp (`lerp = 0.08`) based on normalised mouse pointer coordinates `(state.pointer.y * 0.25)` and `(-state.pointer.x * 0.25)`.
- **Mouse Repel**: Mouse screen coordinates are unprojected into world space at $Z=0$ and mapped into the points group's local coordinate space using `inverseMatrix`. Particles within `REPEL_RADIUS` are pushed outwards by `(1 - dist / REPEL_RADIUS) * REPEL_FORCE` with a slight random Z-jitter.

---

## 2. Custom Cursor
Located in: `src/components/ui/custom-cursor.tsx`

Tracks pointer movement and expands when hovering over interactive components.
- **Dott (Center)**: Tracks pointer position `1:1` using raw mouse events inside `requestAnimationFrame` to avoid React re-renders.
- **Ring (Outer)**: Trails behind the center dot using linear interpolation (lerp = `0.15`).
- **Interactive Hover**: When cursor hovers over elements `a, button, input, select, textarea, [role="button"], label`:
  - Ring scales up by `1.8x`
  - Changes border color to `#8b7fff`
  - Gains a soft CSS shadow glow: `box-shadow: 0 0 15px rgba(139,127,255,0.4)`
- **Mouse Down (Click)**: Ring scales down by `0.6x` and fills slightly.

---

## 3. Custom Bezier Easing
Standard transitions (reveals, scroll entrances, headers, text, and loaders) share a unified custom cubic-bezier ease for a premium, snappy spring-like transition instead of linear movements.

- **Entrance Easing**: `[0.16, 1, 0.3, 1]` (custom premium curve).
- **Loader Easing**: `[0.76, 0, 0.24, 1]`.

> [!NOTE]
> All Bezier easing arrays inside Framer Motion are explicitly cast as `as const` tuples in TypeScript to satisfy strict type declarations.

---

## 4. Accessibility & Performance Optimizations
- **Mobile Check**: Touch pointer coarse checking `window.matchMedia("(pointer: coarse)")` is executed on mount. 
  - If a touch-screen is detected, the custom cursor and R3F canvas are **disabled** completely.
  - Custom cursor falls back to native OS rendering.
  - Hero Canvas falls back to a clean radial gradient: `bg-[radial-gradient(circle_at_center,rgba(139,127,255,0.12),transparent_60%)]`.
- **Reduced Motion Check**: Listens to OS prefers-reduced-motion triggers: `window.matchMedia("(prefers-reduced-motion: reduce)")`.
  - If enabled, all 3D canvas rendering and custom cursors are automatically bypassed.

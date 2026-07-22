"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

/* ---- TWEAK KNOBS ---------------------------------------------------------- */
const PARTICLE_COUNT = 4000;
const SPHERE_RADIUS = 1.4;
const PARTICLE_SIZE = 0.045;
const REPEL_RADIUS = 0.9;
const REPEL_FORCE = 0.55;
const RETURN_LERP = 0.10;
const MORPH_LERP = 0.14;
const ROTATION_SPEED = 0.0016;
const LEFT_FRACTION = 0.26;

/* ---- DESIGN TOKENS -------------------------------------------------------- */
const COL = {
  primary: "#2BA0DC", // brand — borders, active-card fill, interactive
  accent: "#43C2D8", // glow, ring highlights, particle color
  text: "#f6f6fd",
};

/* ============================================================================
   SHAPE GENERATORS — each returns a Float32Array(PARTICLE_COUNT*3).
   Indices map 1:1 across shapes so morphing is a per-particle position lerp.
   ========================================================================== */
const TAU = Math.PI * 2;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function makeSphere(n: number, r: number): Float32Array {
  const a = new Float32Array(n * 3);
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    a[i * 3] = Math.cos(th) * rad * r;
    a[i * 3 + 1] = y * r;
    a[i * 3 + 2] = Math.sin(th) * rad * r;
  }
  return a;
}

// Rounded speech bubble (filled) with a tail at the lower-left.
function makeBubble(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const W = 1.5, H = 1.05, cr = 0.42;
  const inRounded = (x: number, y: number) => {
    const ax = Math.abs(x), ay = Math.abs(y);
    if (ax <= W - cr || ay <= H - cr) return ax <= W && ay <= H;
    const dx = ax - (W - cr), dy = ay - (H - cr);
    return dx * dx + dy * dy <= cr * cr;
  };
  for (let i = 0; i < n; i++) {
    let x, y;
    if (i % 9 === 0) { // ~11% form the tail triangle
      const t = Math.random(), s = Math.random() * t;
      x = -0.55 + (s - t * 0.5) * 0.7;
      y = -H - t * 0.62 + 0.02;
    } else {
      do {
        x = rnd(-W, W);
        y = rnd(-H, H);
      } while (!inRounded(x, y));
    }
    a[i * 3] = x;
    a[i * 3 + 1] = y + 0.18;
    a[i * 3 + 2] = rnd(-0.1, 0.1);
  }
  // Bounding radius is ~1.93. Scale to 1.4.
  const scale = 1.4 / 1.93;
  for (let i = 0; i < n * 3; i++) {
    a[i] *= scale;
  }
  return a;
}

// Central node + radiating satellite nodes joined by link points.
function makeHub(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const SAT = 6, R = 1.45;
  const sat: [number, number][] = [];
  for (let s = 0; s < SAT; s++) {
    const ang = (s / SAT) * TAU + 0.3;
    sat.push([Math.cos(ang) * R, Math.sin(ang) * R]);
  }
  for (let i = 0; i < n; i++) {
    let x, y;
    const bucket = i % 5;
    if (bucket === 0) { // 20% center cluster
      const a2 = Math.random() * TAU, rr = Math.random() * 0.28;
      x = Math.cos(a2) * rr;
      y = Math.sin(a2) * rr;
    } else if (bucket === 1) { // 20% satellite clusters
      const s = sat[i % SAT];
      const a2 = Math.random() * TAU, rr = Math.random() * 0.2;
      x = s[0] + Math.cos(a2) * rr;
      y = s[1] + Math.sin(a2) * rr;
    } else { // 60% along links
      const s = sat[i % SAT];
      const t = Math.random();
      x = s[0] * t + (Math.random() - 0.5) * 0.05;
      y = s[1] * t + (Math.random() - 0.5) * 0.05;
    }
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = rnd(-0.12, 0.12);
  }
  // Bounding radius is ~1.65. Scale to 1.4.
  const scale = 1.4 / 1.65;
  for (let i = 0; i < n * 3; i++) {
    a[i] *= scale;
  }
  return a;
}

// Concentric ripple rings (sound waves) — flat, with gentle z undulation.
function makeWaves(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const rings = [0.32, 0.62, 0.92, 1.22, 1.5];
  for (let i = 0; i < n; i++) {
    const ri = i % rings.length;
    const r = rings[ri] + (Math.random() - 0.5) * 0.04;
    const ang = Math.random() * TAU;
    a[i * 3] = Math.cos(ang) * r;
    a[i * 3 + 1] = Math.sin(ang) * r;
    a[i * 3 + 2] = Math.sin(ang * 6 + ri) * 0.12;
  }
  // Bounding radius is ~1.52. Scale to 1.4.
  const scale = 1.4 / 1.52;
  for (let i = 0; i < n * 3; i++) {
    a[i] *= scale;
  }
  return a;
}

// Funnel: stacked rings whose radius shrinks toward the bottom (cone).
function makeFunnel(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const top = 1.0, bot = -1.05, rTop = 1.45, rBot = 0.04;
  for (let i = 0; i < n; i++) {
    const t = Math.random(); // 0=top wide, 1=bottom point
    const y = top + (bot - top) * t;
    const r = rTop + (rBot - rTop) * t;
    const ang = Math.random() * TAU;
    a[i * 3] = Math.cos(ang) * r;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = Math.sin(ang) * r;
  }
  // Bounding radius is ~1.76. Scale to 1.4.
  const scale = 1.4 / 1.76;
  for (let i = 0; i < n * 3; i++) {
    a[i] *= scale;
  }
  return a;
}

// Gear / cog silhouette — toothed outer rim, body fill, inner hole.
function makeGear(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const teeth = 9, rOut = 1.45, rIn = 1.12, rHole = 0.42;
  for (let i = 0; i < n; i++) {
    const bucket = i % 5;
    let x, y;
    if (bucket < 3) { // 60% toothed outline
      const ang = Math.random() * TAU;
      const phase = ((ang / TAU) * teeth) % 1;
      const r = (phase < 0.5 ? rOut : rIn) + (Math.random() - 0.5) * 0.04;
      x = Math.cos(ang) * r;
      y = Math.sin(ang) * r;
    } else if (bucket === 3) { // 20% body fill ring
      const ang = Math.random() * TAU;
      const r = rnd(rHole + 0.08, rIn - 0.04);
      x = Math.cos(ang) * r;
      y = Math.sin(ang) * r;
    } else { // 20% inner hole ring
      const ang = Math.random() * TAU;
      const r = rHole + (Math.random() - 0.5) * 0.05;
      x = Math.cos(ang) * r;
      y = Math.sin(ang) * r;
    }
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = rnd(-0.12, 0.12);
  }
  // Bounding radius is ~1.47. Scale to 1.4.
  const scale = 1.4 / 1.47;
  for (let i = 0; i < n * 3; i++) {
    a[i] *= scale;
  }
  return a;
}

const SHAPE_FNS = {
  bubble: makeBubble,
  hub: makeHub,
  waves: makeWaves,
  funnel: makeFunnel,
  gear: makeGear,
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

function hexRgb(h: string): [number, number, number] {
  const m = h.replace("#", "");
  return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
}

const C_PART = hexRgb(COL.accent);
const C_ACC = hexRgb(COL.primary);
const C_DEEP = hexRgb("#0E5FB5");   // deep blue (bottom of gradient)
const C_VIOLET = hexRgb("#7C6FF0"); // violet accent particles

/* Per-service stage tints — each morph shape gets its own hue.
   Pastel (mixed 50% with white) so multiplying vertexColors keeps brightness. */
const STAGE_TINTS: [number, number, number][] = [
  [1, 1, 1],                   // 0 sphere (hero) — neutral
  [0.78, 0.95, 1.0],           // 1 AI Chatbots — cyan
  [0.66, 0.95, 0.78],          // 2 WhatsApp — green
  [0.80, 0.76, 1.0],           // 3 Voice Agents — violet
  [1.0, 0.88, 0.64],           // 4 Lead Qualification — amber
  [1.0, 0.72, 0.78],           // 5 AI Support — rose
];

/* Orbital ring positions (planet feel): tilted circles around the sphere */
function makeRing(n: number, radius: number, tiltX: number, tiltZ: number): Float32Array {
  const a = new Float32Array(n * 3);
  const cx = Math.cos(tiltX), sx = Math.sin(tiltX);
  const cz = Math.cos(tiltZ), sz = Math.sin(tiltZ);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU;
    let x = Math.cos(t) * radius, y = 0, z = Math.sin(t) * radius;
    // tilt around X then Z
    let y1 = y * cx - z * sx, z1 = y * sx + z * cx;
    let x2 = x * cz - y1 * sz, y2 = x * sz + y1 * cz;
    a[i * 3] = x2; a[i * 3 + 1] = y2; a[i * 3 + 2] = z1;
  }
  return a;
}

/* round soft particle sprite */
function makeSprite(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,    "rgba(255,255,255,1.0)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.6)");
    grad.addColorStop(1.0,  "rgba(255,255,255,0.0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(c);
}

interface ParticleFieldProps {
  is3DActive?: boolean;
}

export default function ParticleField({ is3DActive = false }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStatic, setIsStatic] = useState(true);

  // Sync isStatic with is3DActive from parent
  useEffect(() => {
    setIsStatic(!is3DActive);
  }, [is3DActive]);

  useEffect(() => {
    if (isStatic) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: false });
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to static background:", e);
      setIsStatic(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4.2;

    const shapes = [
      makeSphere(PARTICLE_COUNT, SPHERE_RADIUS),
      makeBubble(PARTICLE_COUNT),
      makeHub(PARTICLE_COUNT),
      makeWaves(PARTICLE_COUNT),
      makeFunnel(PARTICLE_COUNT),
      makeGear(PARTICLE_COUNT),
    ];

    const current = new Float32Array(shapes[0]); // start as sphere
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      /* Multi-hue palette (set once — zero runtime cost):
         vertical gradient deep-blue → primary → bright cyan, plus
         ~8% violet accents and ~5% near-white sparks for richness. */
      const yNorm = clamp((shapes[0][i * 3 + 1] / SPHERE_RADIUS + 1) / 2, 0, 1);
      const roll = Math.random();
      let r: number, g: number, b: number;
      if (roll < 0.05) {
        r = 235; g = 250; b = 255;                       // near-white sparks
      } else if (roll < 0.13) {
        r = C_VIOLET[0]; g = C_VIOLET[1]; b = C_VIOLET[2]; // violet accents
      } else if (yNorm > 0.5) {
        const t = (yNorm - 0.5) / 0.5;                    // mid → top: primary → cyan
        r = lerp(C_ACC[0], C_PART[0], t);
        g = lerp(C_ACC[1], C_PART[1], t);
        b = lerp(C_ACC[2], C_PART[2], t);
      } else {
        const t = yNorm / 0.5;                            // bottom → mid: deep → primary
        r = lerp(C_DEEP[0], C_ACC[0], t);
        g = lerp(C_DEEP[1], C_ACC[1], t);
        b = lerp(C_DEEP[2], C_ACC[2], t);
      }
      colors[i * 3] = r / 255;
      colors[i * 3 + 1] = g / 255;
      colors[i * 3 + 2] = b / 255;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(current, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const sprite = makeSprite();
    const mat = new THREE.PointsMaterial({
      size: PARTICLE_SIZE,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);

    /* Sparkle layer — sparse bright twinkles riding on the main cloud.
       Child of `points` so it inherits rotation/position/scale for free. */
    const SPARKLE_COUNT = 220;
    const sIdx = new Uint16Array(SPARKLE_COUNT);
    for (let i = 0; i < SPARKLE_COUNT; i++) sIdx[i] = Math.floor(Math.random() * PARTICLE_COUNT);
    const sPos = new Float32Array(SPARKLE_COUNT * 3);
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({
      size: PARTICLE_SIZE * 2.4,
      map: sprite,
      color: 0xbfefff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const sparkles = new THREE.Points(sGeo, sMat);
    points.add(sparkles);

    /* Orbital rings — "global network" planet feel (hero only, fade out on services) */
    const RING_N = 320;
    const ringGeoA = new THREE.BufferGeometry();
    ringGeoA.setAttribute("position", new THREE.BufferAttribute(makeRing(RING_N, SPHERE_RADIUS * 1.45, 0.42, 0.18), 3));
    const ringGeoB = new THREE.BufferGeometry();
    ringGeoB.setAttribute("position", new THREE.BufferAttribute(makeRing(RING_N, SPHERE_RADIUS * 1.72, -0.30, -0.5), 3));
    const ringMatA = new THREE.PointsMaterial({
      size: PARTICLE_SIZE * 0.8, map: sprite, color: 0x43c2d8, transparent: true,
      opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const ringMatB = new THREE.PointsMaterial({
      size: PARTICLE_SIZE * 0.7, map: sprite, color: 0x8b7cf6, transparent: true,
      opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const ringA = new THREE.Points(ringGeoA, ringMatA);
    const ringB = new THREE.Points(ringGeoB, ringMatB);
    points.add(ringA);
    points.add(ringB);

    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z = 0
    const raycaster = new THREE.Raycaster();
    const mouseWorld = new THREE.Vector3();
    const ndc = new THREE.Vector2();

    const mouse = { x: 0, y: 0, active: false };

    let spinY = 0;
    let tiltX = 0, tiltY = 0;
    let curShape = 0;
    let leftXWorld = 0;
    const introStart = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    let raf = 0, last = performance.now();
    let disposed = false;

    function computeLeftX() {
      const halfH = Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
      const halfW = halfH * camera.aspect;
      leftXWorld = -halfW * (1 - LEFT_FRACTION * 2);
      // watermark parallax (subtle, hero only)
      const watermarkEl = document.getElementById("hero-watermark");
      if (watermarkEl) {
        const drift = -window.scrollY * 0.06;
        watermarkEl.style.transform = `translateY(${drift}px)`;
      }
    }
    computeLeftX();

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      computeLeftX();
    }
    window.addEventListener("resize", resize);
    resize();

    let swirl = 0, lastMx = 0;
    function onMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      swirl = clamp(swirl + (nx - lastMx) * 0.8, -1.2, 1.2); // cursor sweep → spin impulse
      lastMx = nx;
      mouse.x = nx;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.active = true;
      const halfH = Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
      mouseWorld.x = mouse.x * halfH * camera.aspect;
      mouseWorld.y = mouse.y * halfH;
    }
    function onLeave() { mouse.active = false; }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onLeave);

    function frame(now: number) {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      /* ---- scroll-driven state (read each frame, no scroll-jank) ---- */
      const heroEl = document.getElementById("hero");
      const wrapEl = document.getElementById("services");

      const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
      const heroProg = heroRect ? clamp(-heroRect.top / heroRect.height, 0, 1) : 0;

      const wrapRect = wrapEl ? wrapEl.getBoundingClientRect() : null;
      const scrollable = wrapRect ? Math.max(1, wrapRect.height - window.innerHeight) : 1;
      const svcProg = wrapRect ? clamp(-wrapRect.top / scrollable, 0, 1) : 0;
      
      const enter = wrapRect ? clamp((window.innerHeight - wrapRect.top) / window.innerHeight, 0, 1) : 0;
      const leave = wrapRect ? clamp(wrapRect.bottom / (window.innerHeight * 0.6), 0, 1) : 0;
      const vis = enter < 1 ? 1 : Math.min(leave, 1);

      const activeFloat = svcProg * 4; // 5 cards total, indexes 0 to 4
      const i0 = Math.floor(activeFloat), i1 = Math.min(i0 + 1, 4), f = activeFloat - i0;

      const A = shapes[i0 + 1]; // active shape (index 1 to 5)
      const B = shapes[i1 + 1];

      if (!A || !B) {
        console.error("SHAPES ERROR:", {
          i0,
          i1,
          activeFloat,
          svcProg,
          shapesLength: shapes.length,
          hasA: !!A,
          hasB: !!B
        });
        raf = requestAnimationFrame(frame);
        return;
      }

      const damp = enter < 0.02 ? RETURN_LERP : MORPH_LERP;
      const pos = geo.attributes.position.array as Float32Array;
      const repelOn = enter < 0.85 && mouse.active;
      const SPHERE = shapes[0];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const k = i * 3;
        let tx = A[k] + (B[k] - A[k]) * f;
        let ty = A[k + 1] + (B[k + 1] - A[k + 1]) * f;
        let tz = A[k + 2] + (B[k + 2] - A[k + 2]) * f;

        tx = SPHERE[k] + (tx - SPHERE[k]) * enter;
        ty = SPHERE[k + 1] + (ty - SPHERE[k + 1]) * enter;
        tz = SPHERE[k + 2] + (tz - SPHERE[k + 2]) * enter;

        if (repelOn) {
          const dx = pos[k] - mouseWorld.x, dy = pos[k + 1] - mouseWorld.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
            const d = Math.sqrt(d2) || 1e-4;
            const fp = (1 - d / REPEL_RADIUS) * REPEL_FORCE;
            tx += (dx / d) * fp;
            ty += (dy / d) * fp;
          }
        }

        pos[k] += (tx - pos[k]) * damp;
        pos[k + 1] += (ty - pos[k + 1]) * damp;
        pos[k + 2] += (tz - pos[k + 2]) * damp;
      }
      geo.attributes.position.needsUpdate = true;

      const isMobile = window.innerWidth < 768;

      spinY += ROTATION_SPEED * (isMobile ? 1.4 : (1 - enter * 0.55));
      swirl *= 0.94;                              // decay cursor-sweep impulse
      spinY += swirl * dt * 2.0 * (1 - enter);    // swirl spins the globe (hero only)
      const tTiltX = mouse.y * 0.26 * (1 - enter), tTiltY = mouse.x * 0.4 * (1 - enter);
      tiltX += (tTiltX - tiltX) * 0.05;
      tiltY += (tTiltY - tiltY) * 0.05;

      points.rotation.set(tiltX, spinY + tiltY, 0);
      
      const targetPosX = isMobile ? 0 : lerp(0, leftXWorld, enter);
      points.position.x += (targetPosX - points.position.x) * 0.08;

      const introGlobe = easeOut(clamp((performance.now() - introStart - 420) / 900, 0, 1)); // delay 420ms, duration 900ms
      const baseScale = isMobile ? 0.60 : lerp(0.9, 1, introGlobe);
      points.scale.setScalar(baseScale);
      const breathe = 0.92 + 0.06 * Math.sin(now * 0.0012); // subtle living brightness

      // On mobile, fade out particle cloud smoothly when scrolling past Hero section into Services
      const mobileVis = isMobile ? clamp(1 - heroProg * 1.5, 0, 1) : vis;
      mat.opacity = breathe * mobileVis * introGlobe;

      /* sync sparkles to morphing cloud + twinkle */
      for (let i = 0; i < SPARKLE_COUNT; i++) {
        const j = sIdx[i] * 3, k3 = i * 3;
        sPos[k3] = pos[j];
        sPos[k3 + 1] = pos[j + 1];
        sPos[k3 + 2] = pos[j + 2];
      }
      sGeo.attributes.position.needsUpdate = true;
      sMat.opacity = (0.16 + 0.22 * (0.5 + 0.5 * Math.sin(now * 0.0021))) * mobileVis * introGlobe;

      /* Orbit rings: counter-rotate, visible in hero, fade as services enter */
      ringA.rotation.y += dt * 0.22;
      ringB.rotation.y -= dt * 0.16;
      const ringVis = (1 - (isMobile ? heroProg * 1.5 : enter)) * mobileVis * introGlobe;
      ringMatA.opacity = 0.55 * ringVis;
      ringMatB.opacity = 0.40 * ringVis;

      /* Per-service hue tint: blend material color toward the active stage tint */
      const tA = STAGE_TINTS[Math.min(i0 + 1, 5)] || STAGE_TINTS[0];
      const tB = STAGE_TINTS[Math.min(i1 + 1, 5)] || STAGE_TINTS[0];
      const heroMix = 1 - enter; // in hero → neutral white
      const tr = lerp(lerp(tA[0], tB[0], f), 1, heroMix);
      const tg = lerp(lerp(tA[1], tB[1], f), 1, heroMix);
      const tb2 = lerp(lerp(tA[2], tB[2], f), 1, heroMix);
      mat.color.setRGB(
        mat.color.r + (tr - mat.color.r) * 0.06,
        mat.color.g + (tg - mat.color.g) * 0.06,
        mat.color.b + (tb2 - mat.color.b) * 0.06
      );

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      geo.dispose();
      mat.dispose();
      sGeo.dispose();
      sMat.dispose();
      ringGeoA.dispose();
      ringGeoB.dispose();
      ringMatA.dispose();
      ringMatB.dispose();
      sprite.dispose();
      renderer.dispose();
    };
  }, [isStatic]);

  if (isStatic) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-screen w-screen"
        style={{ background: "radial-gradient(70% 60% at 70% 45%, rgba(43,194,216,0.28), rgba(14,95,181,0.05) 50%, rgba(0,0,0,0) 75%)" }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      style={{ transition: "opacity 0.2s linear" }}
    />
  );
}

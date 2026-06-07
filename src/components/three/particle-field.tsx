"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

/* ---- TWEAK KNOBS ---------------------------------------------------------- */
const PARTICLE_COUNT = 4000;
const SPHERE_RADIUS = 1.4;
const PARTICLE_SIZE = 0.022;
const REPEL_RADIUS = 0.9;
const REPEL_FORCE = 0.55;
const RETURN_LERP = 0.10;
const MORPH_LERP = 0.08;
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

/* round soft particle sprite */
function makeSprite(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1.0)");
    grad.addColorStop(0.3, "rgba(255,255,255,0.6)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.0)");
    grad.addColorStop(1.0, "rgba(255,255,255,0.0)");
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
      const m = Math.random();
      colors[i * 3] = lerp(C_PART[0], C_ACC[0], m) / 255;
      colors[i * 3 + 1] = lerp(C_PART[1], C_ACC[1], m) / 255;
      colors[i * 3 + 2] = lerp(C_PART[2], C_ACC[2], m) / 255;
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

    function onMove(e: PointerEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
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

      spinY += ROTATION_SPEED * (1 - enter * 0.55);
      const tTiltX = mouse.y * 0.26 * (1 - enter), tTiltY = mouse.x * 0.4 * (1 - enter);
      tiltX += (tTiltX - tiltX) * 0.05;
      tiltY += (tTiltY - tiltY) * 0.05;

      points.rotation.set(tiltX, spinY + tiltY, 0);
      points.position.x += (lerp(0, leftXWorld, enter) - points.position.x) * 0.08;

      const introGlobe = easeOut(clamp((performance.now() - introStart - 200) / 600, 0, 1)); // delay 200ms, duration 600ms
      points.scale.setScalar(lerp(0.9, 1, introGlobe));
      mat.opacity = 0.95 * vis * introGlobe;

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

"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

/* ---- TWEAK KNOBS ---------------------------------------------------------- */
const PARTICLE_COUNT       = 4000;
const SPHERE_RADIUS        = 1.4;
const PARTICLE_SIZE        = 0.04;   // bumped from 0.025 for crisp visibility
const REPEL_RADIUS         = 1.2;
const REPEL_FORCE          = 0.6;
const RETURN_LERP          = 0.08;
const MORPH_LERP           = 0.08;
const ROTATION_SPEED       = 0.08;
const HERO_SPHERE_OFFSET_X = 1.6;

/* ---- DESIGN TOKENS -------------------------------------------------------- */
const TOKENS = {
  particle: '#43C2D8',
  accent:   '#2BA0DC',
  deep:     '#0E5FB5',
  base:     '#000000',
  raised:   '#050507',
  text:     '#f6f6fd',
  text2:    'rgba(246,246,253,0.6)',
};

/* ============================================================================
   SHAPE GENERATORS  — each returns a Float32Array of length PARTICLE_COUNT*3.
   Equal length so any shape morphs into any other 1:1 by particle index.
   ========================================================================== */
function makeSphere(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    a[i * 3]     = Math.cos(th) * r * SPHERE_RADIUS;
    a[i * 3 + 1] = y * SPHERE_RADIUS;
    a[i * 3 + 2] = Math.sin(th) * r * SPHERE_RADIUS;
  }
  return a;
}

function makeChatBubble(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const W = 1.9, H = 1.25, rad = 0.55, yShift = 0.32;
  const tailN = Math.floor(count * 0.09);
  const bodyN = count - tailN;
  let i = 0;
  // rounded-rectangle body fill (rejection sample)
  while (i < bodyN) {
    const x = (Math.random() * 2 - 1) * W;
    const y = (Math.random() * 2 - 1) * H;
    const ax = Math.abs(x) - (W - rad);
    const ay = Math.abs(y) - (H - rad);
    const inside = (ax < 0 || ay < 0) ? true : (ax * ax + ay * ay) < rad * rad;
    if (inside) {
      a[i * 3]     = x;
      a[i * 3 + 1] = y + yShift;
      a[i * 3 + 2] = (Math.random() * 2 - 1) * 0.12;
      i++;
    }
  }
  // little tail (bottom-left triangle)
  const A = [-0.45, -H + yShift], B = [-1.05, -H - 0.55 + yShift], C = [0.15, -H + yShift];
  for (let k = 0; k < tailN; k++) {
    let r1 = Math.random(), r2 = Math.random();
    if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
    a[i * 3]     = A[0] + r1 * (B[0] - A[0]) + r2 * (C[0] - A[0]);
    a[i * 3 + 1] = A[1] + r1 * (B[1] - A[1]) + r2 * (C[1] - A[1]);
    a[i * 3 + 2] = (Math.random() * 2 - 1) * 0.08;
    i++;
  }
  return a;
}

function makeNetworkHub(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const nodes = 6, R = 1.55;
  const centers = [[0, 0]];
  for (let n = 0; n < nodes; n++) {
    const ang = (n / nodes) * Math.PI * 2 - Math.PI / 2;
    centers.push([Math.cos(ang) * R, Math.sin(ang) * R]);
  }
  const centerN = Math.floor(count * 0.16);
  const spokeN  = Math.floor(count * 0.50);
  const satN    = count - centerN - spokeN;
  let i = 0;
  for (let k = 0; k < centerN; k++) {
    const ang = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 0.30;
    a[i * 3] = Math.cos(ang) * rr; a[i * 3 + 1] = Math.sin(ang) * rr; a[i * 3 + 2] = (Math.random() * 2 - 1) * 0.1; i++;
  }
  for (let k = 0; k < satN; k++) {
    const node = 1 + Math.floor(Math.random() * nodes);
    const ang = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 0.24;
    a[i * 3] = centers[node][0] + Math.cos(ang) * rr;
    a[i * 3 + 1] = centers[node][1] + Math.sin(ang) * rr;
    a[i * 3 + 2] = (Math.random() * 2 - 1) * 0.1; i++;
  }
  for (let k = 0; k < spokeN; k++) {
    const node = 1 + Math.floor(Math.random() * nodes);
    const t = Math.random();
    a[i * 3]     = centers[node][0] * t + (Math.random() * 2 - 1) * 0.035;
    a[i * 3 + 1] = centers[node][1] * t + (Math.random() * 2 - 1) * 0.035;
    a[i * 3 + 2] = (Math.random() * 2 - 1) * 0.05; i++;
  }
  return a;
}

function makeSoundWaves(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const bars = 15, spread = 3.4;
  const heights: number[] = [];
  for (let b = 0; b < bars; b++) {
    const x = b / (bars - 1);
    heights[b] = 0.28 + Math.sin(x * Math.PI) * 1.35 * (0.55 + 0.45 * Math.abs(Math.sin(b * 1.7 + 0.6)));
  }
  for (let i = 0; i < count; i++) {
    const b = i % bars;
    const h = heights[b];
    a[i * 3]     = (b / (bars - 1) - 0.5) * spread + (Math.random() * 2 - 1) * 0.035;
    a[i * 3 + 1] = (Math.random() * 2 - 1) * h;
    a[i * 3 + 2] = (Math.random() * 2 - 1) * 0.06;
  }
  return a;
}

function makeBullseye(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const radii = [0.5, 1.0, 1.5, 1.95];
  const total = radii.reduce((s, r) => s + r, 0);
  const centerN = Math.floor(count * 0.08);
  let i = 0;
  for (let k = 0; k < centerN; k++) {
    const ang = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 0.18;
    a[i * 3] = Math.cos(ang) * rr; a[i * 3 + 1] = Math.sin(ang) * rr; a[i * 3 + 2] = 0; i++;
  }
  const remain = count - centerN;
  for (let r = 0; r < radii.length; r++) {
    const n = (r === radii.length - 1) ? count - i : Math.floor(remain * radii[r] / total);
    for (let k = 0; k < n && i < count; k++) {
      const ang = Math.random() * Math.PI * 2;
      const rr = radii[r] + (Math.random() * 2 - 1) * 0.05;
      a[i * 3] = Math.cos(ang) * rr; a[i * 3 + 1] = Math.sin(ang) * rr; a[i * 3 + 2] = (Math.random() * 2 - 1) * 0.04; i++;
    }
  }
  while (i < count) { a[i * 3] = 0; a[i * 3 + 1] = 0; a[i * 3 + 2] = 0; i++; }
  return a;
}

function makeGear(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const outer = 1.7, toothH = 0.34, inner = 0.6;
  const teeth = 9;
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const tooth = Math.sin(ang * teeth) > 0 ? toothH : 0;        // blocky teeth
    const outR = outer - toothH / 2 + tooth;
    const rr = inner + Math.sqrt(Math.random()) * (outR - inner); // annulus fill (hole in center)
    a[i * 3]     = Math.cos(ang) * rr;
    a[i * 3 + 1] = Math.sin(ang) * rr;
    a[i * 3 + 2] = (Math.random() * 2 - 1) * 0.08;
  }
  return a;
}

/* round soft particle sprite */
function makeSprite(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.85)');
    grad.addColorStop(1,   'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(c);
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smoothstep = (e0: number, e1: number, x: number) => { 
  const t = clamp((x - e0) / (e1 - e0), 0, 1); 
  return t * t * (3 - 2 * t); 
};

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

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 5;

    const shapes = [
      makeSphere(PARTICLE_COUNT),
      makeChatBubble(PARTICLE_COUNT),
      makeNetworkHub(PARTICLE_COUNT),
      makeSoundWaves(PARTICLE_COUNT),
      makeBullseye(PARTICLE_COUNT),
      makeGear(PARTICLE_COUNT),
    ];
    const current = new Float32Array(shapes[0]); // start as sphere
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(current, 3));

    const sprite = makeSprite();
    const mat = new THREE.PointsMaterial({
      size: PARTICLE_SIZE,
      map: sprite,
      color: new THREE.Color(TOKENS.particle),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    const group = new THREE.Group();
    group.add(points);
    group.position.x = HERO_SPHERE_OFFSET_X;
    scene.add(group);

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z = 0
    const raycaster = new THREE.Raycaster();
    const mouseWorld = new THREE.Vector3();
    const ndc = new THREE.Vector2();

    const mouse = { x: 0, y: 0, active: false };

    let spinY = 0;
    let tiltX = 0, tiltY = 0;
    let curShape = 0;
    let raf = 0, last = performance.now();
    let disposed = false;

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    function onMove(e: PointerEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.active = true;
    }
    function onLeave() { mouse.active = false; }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerout', onLeave);

    function frame(now: number) {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      /* ---- scroll-driven state (read each frame, no scroll-jank) ---- */
      const heroEl = document.getElementById('hero');
      const wrapEl = document.getElementById('services-container');

      const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
      const heroProg = heroRect ? clamp(-heroRect.top / heroRect.height, 0, 1) : 0;

      const wrapRect = wrapEl ? wrapEl.getBoundingClientRect() : null;
      const scrollable = wrapRect ? Math.max(1, wrapRect.height - window.innerHeight) : 1;
      const svcProg = wrapRect ? clamp(-wrapRect.top / scrollable, 0, 1) : 0;
      const stuck = wrapRect ? wrapRect.top <= 0 : false;
      const step = clamp(Math.floor(svcProg * 5), 0, 4);
      const shapeIndex = stuck ? step + 1 : 0;

      if (shapeIndex !== curShape) curShape = shapeIndex;

      // canvas opacity: fade out as services end
      const op = 1 - smoothstep(0.84, 1.0, svcProg);
      if (canvas) canvas.style.opacity = String(op);

      /* ---- group position: right half in hero, drift down on travel ---- */
      const targetGX = HERO_SPHERE_OFFSET_X;
      const targetGY = stuck ? 0 : -heroProg * 1.4;
      group.position.x += (targetGX - group.position.x) * (1 - Math.pow(1 - 0.1, dt * 60));
      group.position.y += (targetGY - group.position.y) * (1 - Math.pow(1 - 0.1, dt * 60));

      /* ---- mouse world point (for repel) ---- */
      ndc.set(mouse.x, mouse.y);
      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);

      /* ---- rotation: auto-spin + cursor tilt ---- */
      spinY += ROTATION_SPEED * dt;
      const wantTiltX = mouse.active ? mouse.y * 0.22 : 0;
      const wantTiltY = mouse.active ? mouse.x * 0.22 : 0;
      tiltX += (wantTiltX - tiltX) * (1 - Math.pow(1 - 0.06, dt * 60));
      tiltY += (wantTiltY - tiltY) * (1 - Math.pow(1 - 0.06, dt * 60));
      group.rotation.y = spinY + tiltY;
      group.rotation.x = tiltX;

      /* ---- per-particle: lerp toward target, apply hero repel ---- */
      const target = shapes[curShape];
      const isHero = curShape === 0;
      const rate = isHero ? RETURN_LERP : MORPH_LERP;
      const f = 1 - Math.pow(1 - rate, dt * 60);
      const gx = group.position.x, gy = group.position.y;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        // morph / return lerp
        current[ix] += (target[ix] - current[ix]) * f;
        current[iy] += (target[iy] - current[iy]) * f;
        current[iz] += (target[iz] - current[iz]) * f;

        // mouse repel only in hero (sphere reacts, then lerps back)
        if (isHero && mouse.active) {
          const wx = current[ix] + gx, wy = current[iy] + gy, wz = current[iz];
          const dx = wx - mouseWorld.x, dy = wy - mouseWorld.y, dz = wz - mouseWorld.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < REPEL_RADIUS && dist > 0.0001) {
            const push = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
            current[ix] += (dx / dist) * push;
            current[iy] += (dy / dist) * push;
            current[iz] += (dz / dist) * push;
          }
        }
      }
      geo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onLeave);
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
        style={{ background: 'radial-gradient(70% 60% at 70% 45%, rgba(43,194,216,0.28), rgba(14,95,181,0.05) 50%, rgba(0,0,0,0) 75%)' }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      style={{ transition: 'opacity 0.2s linear' }}
    />
  );
}

"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// EXPOSED TWEAK KNOBS
export const PARTICLE_COUNT = 4000;
export const SPHERE_RADIUS = 2.0;
export const MORPH_LERP = 0.08;
export const ROTATION_SPEED = 0.08;
export const REPEL_RADIUS = 1.2;
export const REPEL_FORCE = 0.6;

// SHAPE GENERATORS (all output Float32Array of size count * 3)

// 1. Fibonacci Sphere (Hero)
function generateSphere(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = 2 * Math.PI * goldenRatio;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const y = 1 - 2 * t;
    const r = Math.sqrt(1 - y * y);
    const theta = angleIncrement * i;

    const x = Math.cos(theta) * r * radius;
    const z = Math.sin(theta) * r * radius;
    const yVal = y * radius;

    const idx = i * 3;
    arr[idx] = x;
    arr[idx + 1] = yVal;
    arr[idx + 2] = z;
  }
  return arr;
}

// 2. Torus (AI Chatbots)
function generateTorus(count: number, R: number, r: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const segmentsU = 80;
  const segmentsV = count / segmentsU;

  for (let i = 0; i < count; i++) {
    const uIndex = i % segmentsU;
    const vIndex = Math.floor(i / segmentsU);

    const u = (uIndex / segmentsU) * 2 * Math.PI;
    const v = (vIndex / segmentsV) * 2 * Math.PI;

    const x = (R + r * Math.cos(u)) * Math.cos(v);
    const y = r * Math.sin(u);
    const z = (R + r * Math.cos(u)) * Math.sin(v);

    const idx = i * 3;
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = z;
  }
  return arr;
}

// 3. Grid Lattice (WhatsApp Automation)
function generateGridLattice(count: number, size: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const N = Math.ceil(Math.pow(count, 1 / 3)); // 16 for 4000

  for (let i = 0; i < count; i++) {
    const ix = i % N;
    const iy = Math.floor((i % (N * N)) / N);
    const iz = Math.floor(i / (N * N));

    const x = (ix / (N - 1) - 0.5) * size;
    const y = (iy / (N - 1) - 0.5) * size;
    const z = (iz / (N - 1) - 0.5) * size;

    const idx = i * 3;
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = z;
  }
  return arr;
}

// 4. Helix / DNA (Voice Agents)
function generateHelix(count: number, radius: number, heightVal: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const half = count / 2;

  for (let i = 0; i < count; i++) {
    const isSecondStrand = i >= half;
    const subIdx = isSecondStrand ? i - half : i;
    const t = subIdx / half;

    const angle = t * 6 * Math.PI;
    const h = (t - 0.5) * heightVal;
    const strandPhase = isSecondStrand ? Math.PI : 0;

    const x = radius * Math.cos(angle + strandPhase);
    const y = h;
    const z = radius * Math.sin(angle + strandPhase);

    const idx = i * 3;
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = z;
  }
  return arr;
}

// 5. Cone / Spiral (Lead Qualification)
function generateCone(count: number, radius: number, heightVal: number): Float32Array {
  const arr = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * 16 * Math.PI;
    const r = (1 - t) * radius;
    const h = (t - 0.5) * heightVal;

    const x = r * Math.cos(angle);
    const y = h;
    const z = r * Math.sin(angle);

    const idx = i * 3;
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = z;
  }
  return arr;
}

// 6. Ring Galaxy (AI Customer Support)
function generateGalaxy(count: number, maxRadius: number): Float32Array {
  const arr = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * 24 * Math.PI;
    const r = Math.sqrt(t) * maxRadius;
    const x = r * Math.cos(angle + r * 0.5);
    const y = (Math.random() - 0.5) * 0.25;
    const z = r * Math.sin(angle + r * 0.5);

    const idx = i * 3;
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = z;
  }
  return arr;
}

interface ParticlesProps {
  stage: number; // float value from 0 to 5
}

function Particles({ stage }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // 1. Generate position shapes once
  const shapes = useMemo(() => {
    return [
      generateSphere(PARTICLE_COUNT, SPHERE_RADIUS),
      generateTorus(PARTICLE_COUNT, 2.0, 0.5),
      generateGridLattice(PARTICLE_COUNT, 2.5),
      generateHelix(PARTICLE_COUNT, 1.2, 3.2),
      generateCone(PARTICLE_COUNT, 1.8, 3.0),
      generateGalaxy(PARTICLE_COUNT, 2.4),
    ];
  }, []);

  // Allocate current running positions buffer initialized to sphere
  const currentPositions = useMemo(() => {
    return new Float32Array(shapes[0]);
  }, [shapes]);

  // Generate jitter direction values for the mouse repel
  const jitterOffsets = useMemo(() => {
    const jitter = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      jitter[i] = (Math.random() - 0.5) * 0.15;
    }
    return jitter;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const points = pointsRef.current;
    const geometry = points.geometry;
    const positions = geometry.attributes.position.array as Float32Array;

    // Slow rotation
    points.rotation.y += delta * ROTATION_SPEED;

    // Calculate mouse repel locally if stage < 0.8 (Hero)
    const isRepelling = stage < 0.8;
    let localMouse = new THREE.Vector3();

    if (isRepelling) {
      const mouseWorld = new THREE.Vector3(
        state.pointer.x * (viewport.width / 2),
        state.pointer.y * (viewport.height / 2),
        0
      );
      localMouse.copy(mouseWorld);
      points.updateMatrixWorld();
      const localMatrix = points.matrixWorld.clone().invert();
      localMouse.applyMatrix4(localMatrix);
    }

    // Determine shapes to interpolate between based on stage float
    const baseStage = Math.min(Math.floor(stage), 4);
    const nextStage = Math.min(baseStage + 1, 5);
    const ratio = stage - baseStage;

    const baseArray = shapes[baseStage];
    const nextArray = shapes[nextStage];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // 1. Scrub-interpolated target position between current and next stage
      const targetBaseX = baseArray[idx];
      const targetBaseY = baseArray[idx + 1];
      const targetBaseZ = baseArray[idx + 2];

      const targetNextX = nextArray[idx];
      const targetNextY = nextArray[idx + 1];
      const targetNextZ = nextArray[idx + 2];

      let targetX = targetBaseX * (1 - ratio) + targetNextX * ratio;
      let targetY = targetBaseY * (1 - ratio) + targetNextY * ratio;
      let targetZ = targetBaseZ * (1 - ratio) + targetNextZ * ratio;

      // 2. Mouse repel calculations (Hero mode only)
      if (isRepelling) {
        const cx = positions[idx];
        const cy = positions[idx + 1];
        const cz = positions[idx + 2];

        const dx = cx - localMouse.x;
        const dy = cy - localMouse.y;
        const dz = cz - localMouse.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < REPEL_RADIUS) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
          let vx = dx;
          let vy = dy;
          let vz = dz;

          const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 0.001;
          vx /= len;
          vy /= len;
          vz /= len;

          targetX = targetX + vx * force + jitterOffsets[idx] * force;
          targetY = targetY + vy * force + jitterOffsets[idx + 1] * force;
          targetZ = targetZ + vz * force + jitterOffsets[idx + 2] * force;
        }
      }

      // 3. Lerp particle positions toward target positions
      positions[idx] += (targetX - positions[idx]) * MORPH_LERP;
      positions[idx + 1] += (targetY - positions[idx + 1]) * MORPH_LERP;
      positions[idx + 2] += (targetZ - positions[idx + 2]) * MORPH_LERP;
    }

    geometry.attributes.position.needsUpdate = true;

    // Responsive 3D Position and Scale Interpolation based on stage
    // Hero Group positioning: centers rightward.
    // Services Group positioning: shifts further right.
    const isHero = stage <= 1.0;
    const t = Math.min(Math.max(stage, 0), 1.0); // clamped 0..1 translation progress

    const heroX = viewport.width * 0.18;
    const servicesX = viewport.width * 0.23;

    const targetGroupX = heroX * (1 - t) + servicesX * t;
    const targetGroupY = -viewport.height * 0.05 * t;
    const targetScale = 1.0 * (1 - t) + 1.25 * t;

    points.position.x = THREE.MathUtils.lerp(points.position.x, targetGroupX, 0.08);
    points.position.y = THREE.MathUtils.lerp(points.position.y, targetGroupY, 0.08);
    
    points.scale.setScalar(THREE.MathUtils.lerp(points.scale.x, targetScale, 0.08));

    // Group tilt based on mouse pointer coordinates (Hero mode only)
    if (stage < 0.8) {
      const targetTiltX = state.pointer.y * 0.25;
      const targetTiltZ = -state.pointer.x * 0.25;
      points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, targetTiltX, 0.08);
      points.rotation.z = THREE.MathUtils.lerp(points.rotation.z, targetTiltZ, 0.08);
    } else {
      points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, 0, 0.08);
      points.rotation.z = THREE.MathUtils.lerp(points.rotation.z, 0, 0.08);
    }
  });

  // Calculate material opacity based on stage:
  // Fade out completely when scrolling past Services section into Solutions (stage 5.0 -> 5.5)
  let opacity = 0.85;
  if (stage > 4.8) {
    // Fade from 0.85 to 0 as stage goes from 4.8 to 5.2
    opacity = Math.max(0, 0.85 * (1 - (stage - 4.8) / 0.4));
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#43C2D8"
        size={0.025}
        transparent={true}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

interface ParticleFieldProps {
  stage: number;
}

export default function ParticleField({ stage }: ParticleFieldProps) {
  // Hide completely if opacity is driven to zero
  const isHidden = stage >= 5.3;

  if (isHidden) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 select-none bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={1.5} />
        <Particles stage={stage} />
      </Canvas>
    </div>
  );
}

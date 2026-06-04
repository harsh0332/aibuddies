"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// EXPOSED NAMED CONSTANTS
export const PARTICLE_COUNT = 5000;
export const SPHERE_RADIUS = 2;
export const PARTICLE_COLOR = "#8b7fff";
export const PARTICLE_SIZE = 0.025;
export const REPEL_RADIUS = 1.2;
export const REPEL_FORCE = 0.6;
export const RETURN_LERP = 0.08;
export const ROTATION_SPEED = 0.1;

function ParticleSphere() {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // 1. Generate Fibonacci distributed sphere coordinates
  const { originalPositions, currentPositions, jitterOffsets } = useMemo(() => {
    const orig = new Float32Array(PARTICLE_COUNT * 3);
    const curr = new Float32Array(PARTICLE_COUNT * 3);
    const jitter = new Float32Array(PARTICLE_COUNT * 3);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI * goldenRatio;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      // y goes from 1 to -1
      const y = 1 - 2 * t;
      const radius = Math.sqrt(1 - y * y);
      const theta = angleIncrement * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // Local sphere coordinates
      const lx = x * SPHERE_RADIUS;
      const ly = y * SPHERE_RADIUS;
      const lz = z * SPHERE_RADIUS;

      const idx = i * 3;
      orig[idx] = lx;
      orig[idx + 1] = ly;
      orig[idx + 2] = lz;

      // Start current positions at original
      curr[idx] = lx;
      curr[idx + 1] = ly;
      curr[idx + 2] = lz;

      // Jitter direction values
      jitter[idx] = (Math.random() - 0.5) * 0.15;
      jitter[idx + 1] = (Math.random() - 0.5) * 0.15;
      jitter[idx + 2] = (Math.random() - 0.5) * 0.15;
    }

    return { 
      originalPositions: orig, 
      currentPositions: curr, 
      jitterOffsets: jitter 
    };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const points = pointsRef.current;
    const geometry = points.geometry;
    const positions = geometry.attributes.position.array as Float32Array;

    // Slow auto-rotation Y axis
    points.rotation.y += delta * ROTATION_SPEED;

    // Map screen mouse [-1, 1] to world space at z = 0
    const mouseWorld = new THREE.Vector3(
      state.pointer.x * (viewport.width / 2),
      state.pointer.y * (viewport.height / 2),
      0
    );

    // Invert the points mesh's world matrix to transform world mouse to local space
    const localMouse = mouseWorld.clone();
    points.updateMatrixWorld();
    const localMatrix = points.matrixWorld.clone().invert();
    localMouse.applyMatrix4(localMatrix);

    // Update particle positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // Original position coordinates
      const ox = originalPositions[idx];
      const oy = originalPositions[idx + 1];
      const oz = originalPositions[idx + 2];

      // Current position coordinates
      const cx = positions[idx];
      const cy = positions[idx + 1];
      const cz = positions[idx + 2];

      // Distance from current local position to local mouse pointer
      const dx = cx - localMouse.x;
      const dy = cy - localMouse.y;
      const dz = cz - localMouse.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      let targetX = ox;
      let targetY = oy;
      let targetZ = oz;

      if (dist < REPEL_RADIUS) {
        // Compute push direction vector from localMouse to current position
        const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
        
        let vx = dx;
        let vy = dy;
        let vz = dz;

        // Prevent division by zero
        const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 0.001;
        vx /= len;
        vy /= len;
        vz /= len;

        // Target shifts outward with a slight random jitter
        targetX = ox + vx * force + jitterOffsets[idx] * force;
        targetY = oy + vy * force + jitterOffsets[idx + 1] * force;
        targetZ = oz + vz * force + jitterOffsets[idx + 2] * force;
      }

      // Smoothly lerp current position towards target position
      positions[idx] += (targetX - cx) * RETURN_LERP;
      positions[idx + 1] += (targetY - cy) * RETURN_LERP;
      positions[idx + 2] += (targetZ - cz) * RETURN_LERP;
    }

    geometry.attributes.position.needsUpdate = true;

    // Tilt the whole sphere toward the mouse
    const targetTiltX = state.pointer.y * 0.25;
    const targetTiltZ = -state.pointer.x * 0.25;

    points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, targetTiltX, 0.08);
    points.rotation.z = THREE.MathUtils.lerp(points.rotation.z, targetTiltZ, 0.08);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={PARTICLE_COLOR}
        size={PARTICLE_SIZE}
        transparent={true}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#05050a] z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ pointerEvents: "auto" }}
      >
        <color attach="background" args={["#05050a"]} />
        <ambientLight intensity={1.5} />
        <ParticleSphere />
      </Canvas>
    </div>
  );
}

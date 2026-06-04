"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// EXPOSED TWEAK KNOBS
export const PARTICLE_COUNT = 4000;
export const SPHERE_RADIUS = 1.4; // Reduced to fit perfectly beside left-aligned headline
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

// 2. Chat Bubble (AI Chatbots)
function generateChatBubble(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = (i / count) * 2 * Math.PI;
    const thickness = (Math.random() - 0.5) * 0.25; // Z depth thickness
    
    let x = 0;
    let y = 0;
    
    // Bottom left corner tail is around theta = 4.3 to 4.7
    if (theta > 4.3 && theta < 4.7) {
      const peak = 1 - Math.abs((theta - 4.5) / 0.2); // 0 at edges, 1 at 4.5
      const r = radius * (1.0 + peak * 0.45);
      x = Math.cos(theta) * r;
      y = Math.sin(theta) * r;
    } else {
      x = Math.cos(theta) * radius;
      y = Math.sin(theta) * radius;
    }
    
    // Add some random inner fill particles to make it look solid
    if (Math.random() < 0.2) {
      const rFactor = Math.random();
      x *= rFactor;
      y *= rFactor;
    }
    
    const idx = i * 3;
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = thickness;
  }
  return arr;
}

// 3. Network Hub / Connected Nodes (WhatsApp Automation)
function generateNetworkHub(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const nodeCount = 5;
  const nodes = [];
  
  for (let n = 0; n < nodeCount; n++) {
    const theta = (n / nodeCount) * 2 * Math.PI;
    nodes.push({
      x: Math.cos(theta) * 1.8,
      y: Math.sin(theta) * 1.8,
      z: (Math.random() - 0.5) * 0.5
    });
  }

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const r = i / count;
    
    if (r < 0.4) {
      // Central Core Sphere
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const rad = Math.random() * 0.5;
      
      arr[idx] = rad * Math.sin(phi) * Math.cos(theta);
      arr[idx + 1] = rad * Math.sin(phi) * Math.sin(theta);
      arr[idx + 2] = rad * Math.cos(phi);
    } else if (r < 0.75) {
      // Outer Nodes
      const nodeIdx = Math.floor(Math.random() * nodeCount);
      const node = nodes[nodeIdx];
      
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const rad = Math.random() * 0.18;
      
      arr[idx] = node.x + rad * Math.sin(phi) * Math.cos(theta);
      arr[idx + 1] = node.y + rad * Math.sin(phi) * Math.sin(theta);
      arr[idx + 2] = node.z + rad * Math.cos(phi);
    } else {
      // Connection Lines
      const nodeIdx = Math.floor(Math.random() * nodeCount);
      const node = nodes[nodeIdx];
      
      const progress = Math.random();
      const jitterX = (Math.random() - 0.5) * 0.05;
      const jitterY = (Math.random() - 0.5) * 0.05;
      const jitterZ = (Math.random() - 0.5) * 0.05;
      
      arr[idx] = node.x * progress + jitterX;
      arr[idx + 1] = node.y * progress + jitterY;
      arr[idx + 2] = node.z * progress + jitterZ;
    }
  }
  return arr;
}

// 4. Sound Waves / Sine ripples (Voice Agents)
function generateSoundWaves(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const channels = 4;
  
  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const channelIdx = i % channels;
    const x = ((i / count) - 0.5) * 4.4;
    
    const channelY = (channelIdx - (channels - 1) / 2) * 0.6;
    const freq = 2.5 + channelIdx * 0.8;
    const amp = 0.35 - channelIdx * 0.05;
    const y = channelY + Math.sin(x * freq) * amp;
    const z = (Math.random() - 0.5) * 0.3;
    
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = z;
  }
  return arr;
}

// 5. Target Bullseye / Concentric Rings (Lead Qualification)
function generateTargetBullseye(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const r = i / count;
    
    let x = 0;
    let y = 0;
    let z = (Math.random() - 0.5) * 0.15;
    
    if (r < 0.7) {
      const ringIdx = Math.floor(Math.random() * 3);
      const ringRadius = ringIdx === 0 ? 0.5 : ringIdx === 1 ? 1.2 : 1.9;
      const theta = Math.random() * 2 * Math.PI;
      x = Math.cos(theta) * ringRadius;
      y = Math.sin(theta) * ringRadius;
    } else {
      const lineIdx = Math.random() < 0.5 ? 0 : 1;
      const pos = ((Math.random() - 0.5) * 4.0);
      
      if (lineIdx === 0) {
        x = pos;
        y = (Math.random() - 0.5) * 0.05;
      } else {
        x = (Math.random() - 0.5) * 0.05;
        y = pos;
      }
    }
    
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = z;
  }
  return arr;
}

// 6. Gear Wheel / Automated Support (AI Customer Support)
function generateGearWheel(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const theta = (i / count) * 2 * Math.PI;
    const z = (Math.random() - 0.5) * 0.4;
    const isInner = Math.random() < 0.25;
    
    let r = 0;
    if (isInner) {
      r = 0.45;
    } else {
      const baseR = 1.3;
      const toothAmp = 0.28;
      const teethCount = 8;
      const toothSignal = Math.sign(Math.sin(teethCount * theta)) * 0.5 + 0.5;
      r = baseR + toothSignal * toothAmp;
      r += (Math.random() - 0.5) * 0.05;
    }
    
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;
    
    arr[idx] = x;
    arr[idx + 1] = y;
    arr[idx + 2] = z;
  }
  return arr;
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const parentGroupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const stageRef = useRef<number>(0);
  const dampenedMouse = useRef(new THREE.Vector3(0, 0, 0));

  // 1. Generate position shapes once and spatially sort them by Y coordinate
  const shapes = useMemo(() => {
    const rawShapes = [
      generateSphere(PARTICLE_COUNT, SPHERE_RADIUS),
      generateChatBubble(PARTICLE_COUNT, 1.8),
      generateNetworkHub(PARTICLE_COUNT),
      generateSoundWaves(PARTICLE_COUNT),
      generateTargetBullseye(PARTICLE_COUNT),
      generateGearWheel(PARTICLE_COUNT),
    ];

    // Spatially sort coordinates by Y value to ensure clean wave morph transitions
    const sortCoords = (arr: Float32Array) => {
      const count = arr.length / 3;
      const pts = [];
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        pts.push({ x: arr[idx], y: arr[idx + 1], z: arr[idx + 2] });
      }
      pts.sort((a, b) => a.y - b.y);
      
      const sorted = new Float32Array(arr.length);
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        sorted[idx] = pts[i].x;
        sorted[idx + 1] = pts[i].y;
        sorted[idx + 2] = pts[i].z;
      }
      return sorted;
    };

    return rawShapes.map(sortCoords);
  }, []);

  // Allocate current running positions buffer initialized to sorted sphere
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
    const time = state.clock.getElapsedTime();

    // Read targetStage from window and smoothly interpolate it in the frame loop
    const targetStage = (window as any).targetStage !== undefined ? (window as any).targetStage : 0;
    stageRef.current = THREE.MathUtils.lerp(stageRef.current, targetStage, 0.08);
    const stage = stageRef.current;

    // Toggle points visible state based on stage (unmounted stage threshold = 5.3)
    const isHidden = stage >= 5.3;
    points.visible = !isHidden;

    if (isHidden) return;

    // Slow rotation
    points.rotation.y += delta * ROTATION_SPEED;

    // Calculate mouse interaction locally if stage < 0.8 (Hero)
    const isInteracting = stage < 0.8;
    let localMouse = new THREE.Vector3();

    if (isInteracting) {
      const mouseWorld = new THREE.Vector3(
        state.pointer.x * (viewport.width / 2),
        state.pointer.y * (viewport.height / 2),
        0
      );
      dampenedMouse.current.lerp(mouseWorld, 0.08);
      localMouse.copy(dampenedMouse.current);
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

      // Calculate particle radial normal direction from origin (for organic wave ripples)
      const baseLen = Math.sqrt(targetX * targetX + targetY * targetY + targetZ * targetZ) || 0.001;
      const nx = targetX / baseLen;
      const ny = targetY / baseLen;
      const nz = targetZ / baseLen;

      // A. Constant organic background breathing (makes the sphere feel alive)
      const breathe = Math.sin(time * 1.8 + baseLen * 2) * 0.04;
      targetX += nx * breathe;
      targetY += ny * breathe;
      targetZ += nz * breathe;

      // B. Mouse spotlight dent & warp (Hero mode only)
      if (isInteracting) {
        // Vector from particle base target position to mouse position
        const dx = localMouse.x - targetX;
        const dy = localMouse.y - targetY;
        const dz = localMouse.z - targetZ;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const INFLUENCE_RADIUS = 2.4;

        if (dist < INFLUENCE_RADIUS) {
          const tFactor = 1.0 - dist / INFLUENCE_RADIUS;
          
          // Indentation: push particles INWARDS (towards center of sphere)
          // Using a smooth quadratic curve for organic crater indent
          const dentForce = -0.55 * tFactor * tFactor;
          
          // Attraction: pull particles gently towards the cursor's spatial coordinates
          const pullForce = 0.15 * tFactor * tFactor;

          targetX += nx * dentForce + (localMouse.x - targetX) * pullForce;
          targetY += ny * dentForce + (localMouse.y - targetY) * pullForce;
          targetZ += nz * dentForce + (localMouse.z - targetZ) * pullForce;
        }
      }

      // 3. Lerp particle positions toward target positions
      positions[idx] += (targetX - positions[idx]) * MORPH_LERP;
      positions[idx + 1] += (targetY - positions[idx + 1]) * MORPH_LERP;
      positions[idx + 2] += (targetZ - positions[idx + 2]) * MORPH_LERP;
    }

    geometry.attributes.position.needsUpdate = true;

    // Responsive 3D Position and Scale Interpolation based on stage
    // Hero Group positioning: shifted further right to sit beside headline text without overflow
    const t = Math.min(Math.max(stage, 0), 1.0); // clamped 0..1 translation progress

    const heroX = viewport.width * 0.24;
    const servicesX = viewport.width * 0.26;

    const targetGroupX = heroX * (1 - t) + servicesX * t;
    const targetGroupY = -viewport.height * 0.05 * t;
    const targetScale = 1.0 * (1 - t) + 1.25 * t;

    // Apply translations and scales to parent group
    if (parentGroupRef.current) {
      const parentGroup = parentGroupRef.current;
      
      // Decoupled smooth mouse-parallax shift to parent group position (only in Hero section, stage < 0.8)
      const parallaxX = isInteracting ? state.pointer.x * (viewport.width * 0.07) : 0;
      const parallaxY = isInteracting ? state.pointer.y * (viewport.height * 0.07) : 0;

      parentGroup.position.x = THREE.MathUtils.lerp(parentGroup.position.x, targetGroupX + parallaxX, 0.08);
      parentGroup.position.y = THREE.MathUtils.lerp(parentGroup.position.y, targetGroupY + parallaxY, 0.08);
      parentGroup.scale.setScalar(THREE.MathUtils.lerp(parentGroup.scale.x, targetScale, 0.08));

      // Decoupled 3D LookAt / Tilt (only on Hero stage)
      if (isInteracting) {
        // Rotate around X based on mouse Y (look up/down)
        const targetTiltX = -state.pointer.y * 0.35;
        // Rotate around Y based on mouse X (look left/right)
        const targetTiltY = state.pointer.x * 0.35;

        parentGroup.rotation.x = THREE.MathUtils.lerp(parentGroup.rotation.x, targetTiltX, 0.08);
        parentGroup.rotation.y = THREE.MathUtils.lerp(parentGroup.rotation.y, targetTiltY, 0.08);
        parentGroup.rotation.z = THREE.MathUtils.lerp(parentGroup.rotation.z, 0, 0.08);
      } else {
        // Reset tilt on stage transition
        parentGroup.rotation.x = THREE.MathUtils.lerp(parentGroup.rotation.x, 0, 0.08);
        parentGroup.rotation.y = THREE.MathUtils.lerp(parentGroup.rotation.y, 0, 0.08);
        parentGroup.rotation.z = THREE.MathUtils.lerp(parentGroup.rotation.z, 0, 0.08);
      }
    }

    // Keep child points clean: handles Y spin and resets any other values to prevent double transformations
    points.rotation.x = 0;
    points.rotation.z = 0;
    points.position.set(0, 0, 0);
    points.scale.setScalar(1);

    // Calculate material opacity based on stage and write directly to material property
    let opacity = 0.85;
    if (stage > 4.8) {
      opacity = Math.max(0, 0.85 * (1 - (stage - 4.8) / 0.4));
    }
    if (points.material) {
      (points.material as THREE.PointsMaterial).opacity = opacity;
    }
  });

  return (
    <group ref={parentGroupRef}>
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
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={1.5} />
        <Particles />
      </Canvas>
    </div>
  );
}

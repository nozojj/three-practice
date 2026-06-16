"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function AuroraBackground() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    meshRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -30]}>
      <planeGeometry args={[100, 100]} />

      <meshBasicMaterial
        color="#0b1d3a"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function SpatialObject({ still }: { still: boolean }) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (still || !group.current) return;
    group.current.rotation.y += (state.pointer.x * 0.24 - group.current.rotation.y) * Math.min(delta * 2.8, 1);
    group.current.rotation.x += (-state.pointer.y * 0.16 - group.current.rotation.x) * Math.min(delta * 2.8, 1);
    if (core.current) core.current.rotation.z += delta * 0.09;
  });

  return (
    <group ref={group} rotation={[0.08, -0.2, 0.08]}>
      <Float speed={still ? 0 : 1.6} rotationIntensity={still ? 0 : 0.25} floatIntensity={still ? 0 : 0.65}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.48, 5]} />
          <meshPhysicalMaterial
            color="#7294ff"
            emissive="#172b78"
            emissiveIntensity={0.42}
            roughness={0.16}
            metalness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={1}
            iridescenceIOR={1.45}
          />
        </mesh>
      </Float>

      <Float speed={still ? 0 : 1.15} rotationIntensity={still ? 0 : 0.35} floatIntensity={still ? 0 : 0.35}>
        <mesh rotation={[1.1, 0.2, 0.3]}>
          <torusGeometry args={[2.04, 0.025, 16, 160]} />
          <meshStandardMaterial color="#d4ff55" emissive="#7ea420" emissiveIntensity={0.8} />
        </mesh>
      </Float>

      <Float speed={still ? 0 : 2} rotationIntensity={still ? 0 : 0.5} floatIntensity={still ? 0 : 0.55}>
        <mesh position={[1.72, 1.16, 0.7]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#ff806a" emissive="#ff5f4a" emissiveIntensity={0.65} />
        </mesh>
      </Float>

      <Float speed={still ? 0 : 1.5} rotationIntensity={still ? 0 : 0.4} floatIntensity={still ? 0 : 0.65}>
        <mesh position={[-1.8, -1.05, 0.5]} rotation={[0.6, 0.3, 0.1]}>
          <octahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color="#9f8cff" emissive="#6a57dd" emissiveIntensity={0.55} />
        </mesh>
      </Float>
    </group>
  );
}

export default function SpatialCanvas({ still }: { still: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 5, 4]} intensity={4.2} color="#dceaff" />
      <pointLight position={[-3, -2, 3]} intensity={18} color="#815cff" />
      <pointLight position={[3, 1, 2]} intensity={12} color="#8ddcff" />
      <SpatialObject still={still} />
    </Canvas>
  );
}

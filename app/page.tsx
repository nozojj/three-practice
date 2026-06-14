"use client";

import { Button } from "@/components/ui/button";
import { Environment, Float, Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import Image from "next/image";
import { useRef, useState } from "react";
import * as THREE from "three";

type Planet = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  thumbnail: string;
  position: [number, number, number];
  scale: number;
};

const planets: Planet[] = [
  {
    name: "ai-lp",
    title: "AI LP Generator",
    subtitle: "AI SaaS Project",
    thumbnail: "/images/AI-LP-Generator.png",
    description: "AIでLPを自動生成するSaaS。Next.js、Clerk、Stripeを使用。",
    link: "https://ai-lp-generator.vercel.app",
    position: [0, 0, 0],
    scale: 1.5,
  },

  {
    name: "threejs",
    title: "Three.js Playground",
    subtitle: "Creative Web Experience",
    thumbnail: "/images/three.png",
    description: "Three.js学習で制作したインタラクティブな表現。",
    link: "https://github.com/nozojj",
    position: [6, 0, 0],
    scale: 0.4,
  },

  {
    name: "hareru",
    title: "Hareru",
    thumbnail: "/images/hareru.png",
    subtitle: "Restaurant Website",
    description: "居酒屋サイト制作。レスポンシブ対応とUI設計を意識。",
    link: "https://nozojj.github.io/hareru-izakaya-site/",
    position: [-6, 0, 0],
    scale: 0.5,
  },

  {
    name: "gym",
    title: "BOOST GYM",
    subtitle: "Landing Page Design",
    thumbnail: "/images/gym.png",
    description: "ジム向けランディングページ。HTML/CSSで制作。",
    link: "https://nozojj.github.io/boost-gym-lp/",
    position: [0, 0, -6],
    scale: 0.45,
  },

  {
    name: "about",
    title: "About Me",
    subtitle: "Frontend Developer Journey",
    thumbnail: "/images/three.png",
    description:
      "React、Next.js、Three.jsを中心に学習中。AI SaaSやLP制作を通して、見た目だけでなく動きのあるWeb体験を作れるフロントエンド開発者を目指しています。",
    link: "https://github.com/nozojj",
    position: [0, 3, 2],
    scale: 0.55,
  },
];

function Ring() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    ref.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0.4, 0]}>
      <torusGeometry args={[2.6, 0.02, 16, 100]} />
      <meshStandardMaterial
        color="#9edcff"
        emissive="#9edcff"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

function PlanetSystem({
  planets,
  onSelect,
}: {
  planets: Planet[];
  onSelect: (name: string, position: [number, number, number]) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    groupRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={groupRef}>
      {planets.map((planet) => (
        <Box
          key={planet.name}
          position={planet.position}
          scale={planet.scale}
          name={planet.name}
          link={planet.link}
          followMouse={false}
          onSelect={onSelect}
        />
      ))}

      <Ring />
    </group>
  );
}

function Box({
  position = [0, 0, 0],
  scale = 1.2,
  followMouse = true,
  name = "",
  link = "",
  onSelect,
}: {
  position?: [number, number, number];
  scale?: number;
  followMouse?: boolean;
  name?: string;
  link?: string;
  onSelect?: (name: string, position: [number, number, number]) => void;
}) {
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const baseX = position[0];
  const baseY = position[1];

  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;

    meshRef.current.position.y =
      baseY + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;

    if (followMouse) {
      meshRef.current.position.x +=
        (baseX + state.pointer.x * 3 - meshRef.current.position.x) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* オーラ */}
      <mesh scale={selected ? 1.15 : hovered ? 1.05 : 1}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshBasicMaterial
          color="#9edcff"
          transparent
          opacity={selected ? 0.1 : hovered ? 0.07 : 0.04}
        />
      </mesh>

      {/* 本体 */}
      <mesh
        scale={selected ? 1.15 : hovered ? 1.05 : 1}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={() => {
          onSelect?.(name, position);
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#9edcff"
          transmission={1}
          roughness={0}
          thickness={1}
          clearcoat={1}
          clearcoatRoughness={0}
          ior={1.5}
          emissive="#9edcff"
          emissiveIntensity={selected ? 2 : hovered ? 0.8 : 0}
        />
      </mesh>
    </group>
  );
}

function CameraFocus({ target }: { target: [number, number, number] | null }) {
  useFrame((state) => {
    if (!target) return;

    state.camera.position.x += (target[0] + 7 - state.camera.position.x) * 0.03;

    state.camera.position.y += (target[1] + 3 - state.camera.position.y) * 0.03;

    state.camera.position.z +=
      (target[2] + 12 - state.camera.position.z) * 0.03;

    state.camera.lookAt(target[0], target[1], target[2]);
  });

  return null;
}

function CameraMove({ enabled }: { enabled: boolean }) {
  useFrame((state) => {
    if (!enabled) return;

    state.camera.position.x +=
      (state.pointer.x * 0.5 - state.camera.position.x) * 0.02;

    state.camera.position.y +=
      (state.pointer.y * 0.3 - state.camera.position.y) * 0.02;

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Home() {
  const [activePlanet, setActivePlanet] = useState("");
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number] | null
  >(null);

  const resetCamera = () => {
    setTargetPosition(null);
    setActivePlanet("");
  };

  const activePlanetData = planets.find(
    (planet) => planet.name === activePlanet,
  );

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onDoubleClick={resetCamera}
    >
      <Canvas
        camera={{ position: [0, 0, 8] }}
        style={{ background: "#050816" }}
      >
        <CameraMove enabled={!targetPosition} />
        <CameraFocus target={targetPosition} />

        <Environment preset="sunset" />
        <Sparkles count={80} scale={15} size={1.5} speed={0.2} opacity={0.5} />
        <Stars radius={150} depth={80} count={8000} fade />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={3} />
        <pointLight position={[0, 0, 5]} intensity={20} />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <PlanetSystem
            planets={planets}
            onSelect={(name, position) => {
              setActivePlanet(name);
              setTargetPosition(position);
            }}
          />
        </Float>
      </Canvas>

      <div
        style={{
          position: "absolute",
          right: "8%",
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          zIndex: 10,
          maxWidth: "450px",

          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          padding: "24px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 40px rgba(158,220,255,0.12)",
        }}
      >
        {activePlanetData && (
          <Image
            src={activePlanetData.thumbnail}
            alt={activePlanetData.title}
            width={400}
            height={220}
            style={{
              width: "100%",
              height: "260px",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "16px",
            }}
          />
        )}

        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: "-3px",
            marginBottom: "20px",
          }}
        >
          {activePlanetData?.title ?? "Developer Galaxy"}
        </h1>

        <p
          style={{
            color: "#9edcff",
            fontWeight: 500,
            marginBottom: "16px",
          }}
        >
          {activePlanetData?.subtitle ?? "Frontend Developer Portfolio"}
        </p>

        {activePlanet ? (
          <>
            <p style={{ marginTop: "12px" }}>{activePlanetData?.description}</p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <Button
                onClick={() => window.open(activePlanetData?.link, "_blank")}
              >
                {activePlanet === "about" ? "View GitHub" : "Visit Project"}
              </Button>

              <Button variant="outline" onClick={resetCamera}>
                Back
              </Button>
            </div>
          </>
        ) : (
          <p style={{ marginTop: "12px", opacity: 0.7 }}>
            Click a planet to explore
          </p>
        )}
      </div>
    </div>
  );
}

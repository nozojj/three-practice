"use client";

import { Button } from "@/components/ui/button";
import { Environment, Float, Sparkles, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import AuroraBackground from "@/components/AuroraBackground";

type Planet = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  github?: string;
  thumbnail: string;
  color: string;
  skills: string[];
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
    github: "https://github.com/nozojj/ai-lp-generator",
    color: "#50d890",
    skills: ["Next.js", "TypeScript", "Prisma", "Clerk", "Stripe"],
    position: [0, 0.7, 0],
    scale: 1.2,
  },

  {
    name: "threejs",
    title: "Three.js Playground",
    subtitle: "Creative Web Experience",
    thumbnail: "/images/three.png",
    description: "Three.js学習で制作したインタラクティブな表現。",
    link: "https://github.com/nozojj",
    github: "https://github.com/nozojj/three-practice",
    color: "#b266ff",
    skills: ["Three.js", "React Three Fiber", "Drei", "TypeScript"],
    position: [5, 0, 0],
    scale: 0.4,
  },

  {
    name: "hareru",
    title: "Hareru",
    thumbnail: "/images/hareru.png",
    subtitle: "Restaurant Website",
    description: "居酒屋サイト制作。レスポンシブ対応とUI設計を意識。",
    link: "https://nozojj.github.io/hareru-izakaya-site/",
    github: "https://github.com/nozojj/hareru-izakaya-site",
    color: "#ffb347",
    skills: ["HTML", "CSS", "Responsive Design"],
    position: [-5, 0, 0],
    scale: 0.5,
  },

  {
    name: "gym",
    title: "BOOST GYM",
    subtitle: "Landing Page Design",
    thumbnail: "/images/gym.png",
    description: "ジム向けランディングページ。HTML/CSSで制作。",
    link: "https://nozojj.github.io/boost-gym-lp/",
    github: "https://github.com/nozojj/boost-gym-lp",
    color: "#ff5c5c",
    skills: ["HTML", "CSS", "Landing Page"],
    position: [0, -4, -5],
    scale: 0.45,
  },

  {
    name: "about",
    title: "About Me",
    subtitle: "Frontend Developer Journey",
    thumbnail: "/images/about.jpg",
    description:
      "未経験からFrontend Developerを目指して学習中。React / Next.js を中心にAI SaaS開発やLP制作に取り組んでいます。現在はThree.jsを学習しながら、インタラクティブなWeb表現とUI/UXの向上に挑戦しています。Goal:・フロントエンドエンジニア転職・AI SaaS開発・海外で働けるレベルの技術力習得",
    link: "https://github.com/nozojj",
    github: "https://github.com/nozojj",
    color: "#66ccff",
    skills: ["React", "Next.js", "Three.js", "UI Design"],
    position: [0, 4, 0],
    scale: 0.55,
  },

  {
    name: "future",
    title: "Future Project",
    subtitle: "Interactive Portfolio v2・Shader・GSAP・WebGL Effects",
    thumbnail: "/images/about.jpg",
    description:
      "現在開発中の新しいプロジェクト。Three.jsやAIを活用したWebアプリを企画中です。",
    link: "https://github.com/nozojj",
    github: "https://github.com/nozojj",
    color: "#fff",
    skills: ["Three.js", "AI", "Next.js"],
    position: [-4, 4, 0],
    scale: 0.45,
  },
];

function Ring({
  position,
  size,
}: {
  position: [number, number, number];
  size: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    ref.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0.4, 0]}>
      <torusGeometry args={[size, 0.06, 16, 100]} />
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
  isMobile,
  activePlanet,
}: {
  planets: Planet[];
  onSelect: (name: string, position: [number, number, number]) => void;
  isMobile: boolean;
  activePlanet: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  // useFrame(() => {
  //   groupRef.current.rotation.y += 0.005;
  // });

  return (
    <group ref={groupRef}>
      {planets.map((planet) => (
        <group key={planet.name}>
          {activePlanet === planet.name && (
            <Ring
              position={planet.position}
              size={planet.name === "ai-lp" ? 3 : 1.4}
            />
          )}

          <Box
            position={planet.position}
            scale={isMobile ? planet.scale * 0.7 : planet.scale}
            isActive={activePlanet === planet.name}
            name={planet.name}
            link={planet.link}
            color={planet.color}
            followMouse={false}
            onSelect={onSelect}
            title={planet.title}
          />
        </group>
      ))}
    </group>
  );
}

function Box({
  position = [0, 0, 0],
  scale = 1.2,
  followMouse = true,
  name = "",
  title = "",
  link = "",
  color = "#9edcff",
  onSelect,
  isActive,
}: {
  position?: [number, number, number];
  scale?: number;
  followMouse?: boolean;
  name?: string;
  link?: string;
  color?: string;
  title?: string;
  onSelect?: (name: string, position: [number, number, number]) => void;
  isActive?: boolean;
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

    if (isActive) {
      const pulse = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;

      meshRef.current.scale.set(pulse * scale, pulse * scale, pulse * scale);
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      {/* オーラ */}
      <mesh scale={hovered ? 1.05 : 1}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.07 : 0.04}
        />
      </mesh>

      {/* 本体 */}
      <mesh
        scale={hovered ? 1.15 : isActive ? 1.5 : 1}
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
          color={color}
          transmission={1}
          roughness={0}
          thickness={1}
          clearcoat={1}
          clearcoatRoughness={0}
          ior={1.5}
          opacity={1}
          transparent
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : isActive ? 2.5 : 0}
        />
      </mesh>
    </group>
  );
}

function CameraFocus({ target }: { target: [number, number, number] | null }) {
  useFrame((state) => {
    if (!target) return;

    state.camera.position.x += (target[0] + 7 - state.camera.position.x) * 0.03;

    state.camera.position.y += (target[1] + 4 - state.camera.position.y) * 0.03;

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
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onDoubleClick={resetCamera}
    >
      <Canvas
        camera={{
          position: isMobile ? [0, 0, 15] : [0, 0, 8],
        }}
        style={{
          background:
            "radial-gradient(circle at center, #0f172a 0%, #020617 100%)",
        }}
      >
        <CameraMove enabled={!targetPosition} />
        <CameraFocus target={targetPosition} />

        {/* <Environment preset="sunset" /> */}
        <AuroraBackground />
        <Sparkles count={80} scale={15} size={1.5} speed={0.2} opacity={0.5} />
        <Stars radius={150} depth={80} count={8000} fade />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={3} />
        <pointLight position={[0, 0, 5]} intensity={20} />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <PlanetSystem
            planets={planets}
            isMobile={isMobile}
            activePlanet={activePlanet}
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
          right: isMobile ? "50%" : "8%",
          top: isMobile ? "auto" : "50%",
          bottom: isMobile ? "10px" : "auto",
          transform: isMobile ? "translateX(50%)" : "translateY(-50%)",
          color: "white",
          zIndex: 10,
          width: isMobile ? "88%" : "450px",
          maxWidth: "450px",

          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          padding: isMobile ? "16px" : "24px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 40px rgba(158,220,255,0.12)",
        }}
      >
        <AnimatePresence mode="wait">
          {activePlanet && activePlanetData ? (
            <>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "rgba(80,216,144,0.2)",
                  border: "1px solid rgba(80,216,144,0.4)",
                  fontSize: "12px",
                  marginBottom: "12px",
                }}
              >
                Selected Project
              </div>

              <motion.h1
                style={{
                  fontSize: "48px",
                  fontWeight: "800",
                  marginBottom: "8px",
                }}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                  duration: 0.4,
                }}
              >
                {activePlanetData.title}
              </motion.h1>

              <p>{activePlanetData?.subtitle}</p>

              <motion.div
                key={activePlanet}
                initial={{
                  opacity: 0,
                  x: 40,
                  scale: 0.92,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: -40,
                  scale: 0.92,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                }}
              >
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
              </motion.div>

              <p style={{ marginTop: "12px" }}>
                {activePlanetData?.description}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "16px",
                  marginBottom: "16px",
                }}
              >
                {activePlanetData?.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "12px",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

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
                  🚀 Visit Project
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(activePlanetData?.github, "_blank")
                  }
                >
                  💻 GitHub
                </Button>

                <Button variant="ghost" onClick={resetCamera}>
                  ← Back
                </Button>
              </div>
            </>
          ) : (
            <>
              <p style={{ marginTop: "12px", opacity: 0.7 }}>
                🪐 Click a planet to explore projects
              </p>

              <p
                style={{
                  marginTop: "8px",
                  opacity: 0.5,
                  fontSize: "14px",
                }}
              >
                Double click anywhere to reset view
              </p>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

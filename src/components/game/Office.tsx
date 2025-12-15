"use client";

import { useGameStore } from "@/stores/gameStore";
import GamingSetup from "./GamingSetup";
import GamingChair from "./GamingChair";

export default function Office() {
    return (
        <group>
            {/* Floor (Warm Wood) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[15, 15]} />
                <meshStandardMaterial color="#5d4037" roughness={0.6} />
            </mesh>

            {/* Ceiling (White) */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
                <planeGeometry args={[15, 15]} />
                <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
            </mesh>

            {/* Back Wall (Accent Color - Navy/Grey) */}
            <mesh position={[0, 2, -5]} receiveShadow>
                <planeGeometry args={[15, 4]} />
                <meshStandardMaterial color="#2d3748" roughness={0.5} />
            </mesh>

            {/* Hexagonal Sound Panels (More subtle) */}
            {[...Array(5)].map((_, i) => (
                <mesh key={i} position={[i * 1.5 - 3, 2, -4.95]} rotation={[0, 0, Math.PI / 6]}>
                    <circleGeometry args={[0.6, 6]} />
                    <meshStandardMaterial color="#4a5568" roughness={0.8} />
                </mesh>
            ))}

            {/* Side Walls (Light Grey - Cozy) */}
            <mesh position={[-7.5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[15, 4]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            <mesh position={[7.5, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[15, 4]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>

            {/* Front Wall */}
            <mesh position={[0, 2, 5]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[15, 4]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>

            {/* Skirting Board */}
            <mesh position={[0, 0.1, -4.95]}>
                <boxGeometry args={[15, 0.2, 0.1]} />
                <meshStandardMaterial color="#1a202c" />
            </mesh>

            {/* Large Area Rug (Cozy Texture) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]} receiveShadow>
                <planeGeometry args={[6, 4]} />
                <meshStandardMaterial color="#888888" roughness={1} />
            </mesh>

            {/* Gaming Setup (Desk, PC, Monitors) */}
            <GamingSetup position={[0, 0, -3]} />

            {/* Gaming Chair */}
            <GamingChair position={[0, 0, -2]} />

            {/* Decorative Plant (Simple Greenery) - Replaces Pink Box for coziness */}
            <group position={[3, 0, -4]}>
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.3, 0.2, 0.8]} />
                    <meshStandardMaterial color="#d4a373" />
                </mesh>
                <mesh position={[0, 1, 0]}>
                    <dodecahedronGeometry args={[0.5]} />
                    <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
                </mesh>
            </group>
        </group>
    );
}

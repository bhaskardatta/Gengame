"use client";

import { useGameStore } from "@/stores/gameStore";
import Computer from "./Computer";
import { useState } from "react";

export default function Office() {
    const setIsSitting = useGameStore((state) => state.setIsSitting);
    const isSitting = useGameStore((state) => state.isSitting);
    const [hovered, setHover] = useState(false);

    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
            </mesh>

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#eeeeee" roughness={0.9} />
            </mesh>

            {/* Walls with Trim */}
            <mesh position={[0, 1.5, -5]}>
                <planeGeometry args={[10, 3]} />
                <meshStandardMaterial color="#a0aec0" />
            </mesh>
            {/* Skirting Board */}
            <mesh position={[0, 0.1, -4.95]}>
                <boxGeometry args={[10, 0.2, 0.1]} />
                <meshStandardMaterial color="#222" />
            </mesh>

            {/* Window Wall (Left) */}
            <group position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                {/* Wall Parts */}
                <mesh position={[0, 1, 0]}>
                    <planeGeometry args={[10, 1]} />
                    <meshStandardMaterial color="#a0aec0" />
                </mesh>
                <mesh position={[0, -1, 0]}>
                    <planeGeometry args={[10, 1]} />
                    <meshStandardMaterial color="#a0aec0" />
                </mesh>
                <mesh position={[-4, 0, 0]}>
                    <planeGeometry args={[2, 1]} />
                    <meshStandardMaterial color="#a0aec0" />
                </mesh>
                <mesh position={[4, 0, 0]}>
                    <planeGeometry args={[2, 1]} />
                    <meshStandardMaterial color="#a0aec0" />
                </mesh>

                {/* The Window Glass */}
                <mesh position={[0, 0, -0.1]}>
                    <planeGeometry args={[6, 1]} />
                    <meshBasicMaterial color="#87CEEB" toneMapped={false} />
                </mesh>
            </group>
            <mesh position={[5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[10, 3]} />
                <meshStandardMaterial color="#8899a6" />
            </mesh>
            <mesh position={[0, 1.5, 5]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[10, 3]} />
                <meshStandardMaterial color="#8899a6" />
            </mesh>

            {/* Rug */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]} receiveShadow>
                <circleGeometry args={[1.5, 32]} />
                <meshStandardMaterial color="#3b82f6" roughness={1} />
            </mesh>

            {/* Desk */}
            <mesh position={[0, 0.75, -3]} castShadow receiveShadow>
                <boxGeometry args={[2.5, 0.1, 1.2]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Desk Legs */}
            <mesh position={[-1.1, 0.375, -3]} castShadow>
                <boxGeometry args={[0.1, 0.75, 1]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[1.1, 0.375, -3]} castShadow>
                <boxGeometry args={[0.1, 0.75, 1]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Computer on Desk */}
            <Computer position={[0, 0.8, -3]} />

            {/* Interactable Chair */}
            <group
                position={[0, 0, -2]}
                onClick={() => setIsSitting(!isSitting)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <mesh position={[0, 0.3, 0]} castShadow>
                    <boxGeometry args={[0.6, 0.1, 0.6]} />
                    <meshStandardMaterial color={hovered ? "orange" : "#1a1a1a"} />
                </mesh>
                <mesh position={[0, 0.8, 0.25]} castShadow>
                    <boxGeometry args={[0.6, 0.8, 0.1]} />
                    <meshStandardMaterial color={hovered ? "orange" : "#1a1a1a"} />
                </mesh>
                <mesh position={[0, 0.15, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.3, 0.3]} />
                    <meshStandardMaterial color="#555" />
                </mesh>
            </group>

        </group>
    );
}

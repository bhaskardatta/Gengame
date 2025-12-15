"use client";

import { useRef, useState } from "react";
import { useGameStore } from "@/stores/gameStore";

export default function GamingChair(props: any) {
    const setIsSitting = useGameStore((state) => state.setIsSitting);
    const [hovered, setHover] = useState(false);

    // Colors
    const primaryColor = "#111111";
    const accentColor = "#ff3333"; // Red accents

    return (
        <group
            {...props}
            onClick={(e) => {
                e.stopPropagation();
                document.exitPointerLock();
                setTimeout(() => setIsSitting(true), 100);
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            {/* Base (Wheels) */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 5]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            {[0, 72, 144, 216, 288].map((angle, i) => (
                <mesh key={i} rotation={[0, (angle * Math.PI) / 180, 0]} position={[0, 0.1, 0]}>
                    <mesh position={[0.25, 0, 0]}>
                        <boxGeometry args={[0.5, 0.05, 0.05]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                    <mesh position={[0.45, -0.05, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 0.1]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                </mesh>
            ))}

            {/* Gas Lift */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Seat Base */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.7, 0.1, 0.6]} />
                <meshStandardMaterial color={primaryColor} />
            </mesh>

            {/* Cushion Side Bolsters */}
            <mesh position={[-0.3, 0.6, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.15, 0.2, 0.6]} />
                <meshStandardMaterial color={accentColor} />
            </mesh>
            <mesh position={[0.3, 0.6, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.15, 0.2, 0.6]} />
                <meshStandardMaterial color={accentColor} />
            </mesh>

            {/* Backrest */}
            <group position={[0, 1.1, 0.25]} rotation={[-0.1, 0, 0]}>
                {/* Main Back */}
                <mesh>
                    <boxGeometry args={[0.6, 1.2, 0.1]} />
                    <meshStandardMaterial color={primaryColor} />
                </mesh>
                {/* Side Wings */}
                <mesh position={[-0.28, 0, 0.05]} rotation={[0, -0.4, 0]}>
                    <boxGeometry args={[0.15, 1.2, 0.1]} />
                    <meshStandardMaterial color={accentColor} />
                </mesh>
                <mesh position={[0.28, 0, 0.05]} rotation={[0, 0.4, 0]}>
                    <boxGeometry args={[0.15, 1.2, 0.1]} />
                    <meshStandardMaterial color={accentColor} />
                </mesh>

                {/* Headrest Pillow */}
                <mesh position={[0, 0.45, 0.08]}>
                    <boxGeometry args={[0.4, 0.2, 0.1]} />
                    <meshStandardMaterial color={primaryColor} />
                </mesh>
            </group>

            {/* Armrests */}
            <mesh position={[-0.35, 0.8, 0]}>
                <boxGeometry args={[0.08, 0.4, 0.4]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.35, 0.8, 0]}>
                <boxGeometry args={[0.08, 0.4, 0.4]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Highlight Effect */}
            {hovered && (
                <pointLight position={[0, 1, 0]} intensity={2} color="white" distance={2} />
            )}
        </group>
    );
}

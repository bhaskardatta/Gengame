"use client";

import { useGameStore } from "@/stores/gameStore";

export default function Computer(props: any) {
    const isSitting = useGameStore((state) => state.isSitting);

    return (
        <group {...props}>
            {/* Monitor Stand */}
            <mesh position={[0, 0.2, 0]} castShadow>
                <boxGeometry args={[0.2, 0.4, 0.1]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, 0.025, 0]} castShadow>
                <boxGeometry args={[0.4, 0.05, 0.3]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Monitor Bezel */}
            <mesh position={[0, 0.6, 0.05]} castShadow>
                <boxGeometry args={[1.35, 0.85, 0.05]} />
                <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Screen Surface */}
            <mesh position={[0, 0.6, 0.051]}>
                <planeGeometry args={[1.25, 0.75]} />
                {/* When sitting, the screen glows blue (OS is active), otherwise it's black */}
                <meshStandardMaterial
                    color={isSitting ? "#001d35" : "#050505"}
                    emissive={isSitting ? "#0066cc" : "#000000"}
                    emissiveIntensity={isSitting ? 0.5 : 0}
                    roughness={0.2}
                />
            </mesh>

            {/* REMOVED <Html> COMPONENT TO PREVENT GLITCHES. 
                WE USE THE 2D OVERLAY IN page.tsx INSTEAD. */}
        </group>
    );
}

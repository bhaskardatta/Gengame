"use client";

import { Html } from "@react-three/drei";
import VirtualDesktop from "../os/VirtualDesktop";
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

            {/* Screen (Interactive HTML) */}
            <mesh position={[0, 0.6, 0.051]}>
                <planeGeometry args={[1.25, 0.75]} />
                <meshStandardMaterial color="#000000" />
                {isSitting && (
                    <Html
                        transform
                        wrapperClass="htmlScreen"
                        distanceFactor={1.17}
                        position={[0, 0, 0.01]}
                        style={{
                            width: "1024px",
                            height: "768px",
                            background: "black",
                            overflow: "hidden",
                            borderRadius: "4px"
                        }}
                    >
                        <VirtualDesktop />
                    </Html>
                )}
            </mesh>
        </group>
    );
}

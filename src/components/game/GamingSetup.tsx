"use client";

import Computer from "./Computer";

export default function GamingSetup(props: any) {
    return (
        <group {...props}>
            {/* --- DESK --- */}
            {/* Tabletop */}
            <mesh position={[0, 0.75, 0]} receiveShadow castShadow>
                <boxGeometry args={[3, 0.1, 1.2]} />
                <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
            </mesh>

            {/* LED Strip Back */}
            <mesh position={[0, 0.75, -0.61]}>
                <boxGeometry args={[3, 0.05, 0.02]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>

            {/* Legs (Z-Shape Style) */}
            <mesh position={[-1.2, 0.375, 0]}>
                <boxGeometry args={[0.1, 0.75, 1]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[1.2, 0.375, 0]}>
                <boxGeometry args={[0.1, 0.75, 1]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* --- MONITORS --- */}
            {/* Main Monitor (Computer Component) */}
            <Computer position={[0, 0.75, 0]} />

            {/* Secondary Monitor (Left, Angled) */}
            <group position={[-1.3, 1.35, -0.1]} rotation={[0, 0.3, 0]}>
                <mesh castShadow>
                    <boxGeometry args={[1.2, 0.7, 0.05]} />
                    <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.03]}>
                    <planeGeometry args={[1.15, 0.65]} />
                    <meshBasicMaterial color="#000033" />
                </mesh>
                {/* Stand */}
                <mesh position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>
            </group>

            {/* --- PC TOWER --- */}
            <group position={[1.2, 1.05, 0]} rotation={[0, -0.2, 0]}>
                {/* Case */}
                <mesh castShadow>
                    <boxGeometry args={[0.3, 0.6, 0.6]} />
                    <meshStandardMaterial color="#111" metalness={0.6} roughness={0.2} />
                </mesh>
                {/* Glass Side Panel */}
                <mesh position={[-0.155, 0, 0]}>
                    <planeGeometry args={[0.6, 0.6]} />
                    <meshPhysicalMaterial
                        color="black"
                        transmission={0.5}
                        opacity={0.5}
                        transparent
                        roughness={0}
                        ior={1.5}
                        thickness={0.01}
                    />
                </mesh>
                {/* Internal RGB Components */}
                <mesh position={[0, 0.1, 0]}>
                    <boxGeometry args={[0.05, 0.05, 0.3]} />
                    <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3} />
                </mesh>
                <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.05]} />
                    <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={3} />
                </mesh>
            </group>

            {/* --- PERIPHERALS --- */}
            {/* Extended Mousepad */}
            <mesh position={[0, 0.81, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[2, 0.8]} />
                <meshStandardMaterial color="#111" roughness={0.9} />
            </mesh>

            {/* Keyboard */}
            <group position={[0, 0.82, 0.2]}>
                <mesh castShadow>
                    <boxGeometry args={[0.6, 0.02, 0.2]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                {/* RGB Glow */}
                <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.58, 0.18]} />
                    <meshStandardMaterial color="#aa00ff" emissive="#aa00ff" emissiveIntensity={0.5} />
                </mesh>
            </group>

            {/* Mouse */}
            <group position={[0.4, 0.82, 0.2]}>
                <mesh castShadow>
                    <boxGeometry args={[0.1, 0.04, 0.15]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                <mesh position={[0, 0.021, -0.05]}>
                    <boxGeometry args={[0.01, 0.01, 0.03]} />
                    <meshStandardMaterial color="#00ff00" emissive="#00ff00" />
                </mesh>
            </group>
        </group>
    );
}

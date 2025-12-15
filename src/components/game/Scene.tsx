"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Suspense, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import Office from "./Office";
import Player from "./Player";
import { Loader } from "@react-three/drei";

export default function Scene() {
    const isSitting = useGameStore((state) => state.isSitting);

    // Handle Escape Key to Stand Up
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isSitting) {
                useGameStore.getState().setIsSitting(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSitting]);

    return (
        // The container takes the full size of the parent (which is now fixed/fullscreen)
        <div className="w-full h-full relative">
            <Canvas
                shadows
                camera={{ fov: 60 }}
                className="bg-black"
                dpr={[1, 2]}
                // This ensures the canvas resizes correctly without stretching
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            >
                <Suspense fallback={null}>
                    {/* Brighter overall lighting for "nice" feel */}
                    <ambientLight intensity={1.8} />
                    <pointLight position={[2, 4, 2]} intensity={60} castShadow shadow-mapSize={[2048, 2048]} color="#fffcf0" />
                    {/* Fill light from screen direction - softer blue */}
                    <pointLight position={[0, 1.5, -2]} intensity={8} color="#00aaff" distance={8} />

                    <Physics gravity={[0, -9.8, 0]}>
                        <Office />
                        <Player />
                    </Physics>
                </Suspense>
            </Canvas>
            <Loader />

            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-1 h-1 bg-white rounded-full opacity-80 shadow-[0_0_4px_white]" />
            </div>
        </div>
    );
}

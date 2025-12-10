"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Suspense, useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import Office from "./Office";
import Player from "./Player";
import { Loader, PointerLockControls } from "@react-three/drei";

export default function Scene() {
    const isSitting = useGameStore((state) => state.isSitting);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                useGameStore.getState().setIsSitting(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <Canvas
                shadows
                camera={{ fov: 60 }}
                className="bg-black"
                gl={{ preserveDrawingBuffer: true, alpha: false, antialias: true }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={1.5} />
                    <pointLight position={[2, 4, 2]} intensity={50} castShadow shadow-mapSize={[2048, 2048]} />
                    <pointLight position={[-2, 3, -2]} intensity={20} color="#b0c4de" />
                    <hemisphereLight args={["#ffffff", "#444444", 0.8]} />
                    <Physics gravity={[0, -9.8, 0]}>
                        <Office />
                        <Player />
                    </Physics>

                    {/* Controls - Only active when NOT sitting */}
                    {/* Controls - Handled by Player component */}
                </Suspense>
            </Canvas>
            <Loader />

            {/* HUD / Crosshair - Always visible unless sitting */}
            {!isSitting && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                    {/* Outer Ring */}
                    <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
                        {/* Inner Dot */}
                        <div className="w-1 h-1 bg-white rounded-full bg-opacity-90 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                    </div>

                    {/* Dynamic Interaction Text could go here */}
                </div>
            )}

            {/* Help / Controls Hint */}
            {!isSitting && (
                <div className="absolute bottom-8 left-8 text-white/50 font-mono text-sm z-40 pointer-events-none">
                    [WASD] Move &nbsp; [MOUSE] Look &nbsp; [CLICK CHAIR] Sit
                </div>
            )}

            {/* Exit Button - High Contrast */}
            {isSitting && (
                <div className="absolute top-6 right-6 z-50">
                    <button
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-400 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                        onClick={() => useGameStore.getState().setIsSitting(false)}
                    >
                        <span>STAND UP</span>
                        <span className="text-xs opacity-75 bg-red-800 px-1.5 py-0.5 rounded">ESC</span>
                    </button>
                </div>
            )}
        </>
    );
}

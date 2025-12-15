"use client";

import dynamic from "next/dynamic";
import { Loader } from "@react-three/drei";
import { useGameStore } from "@/stores/gameStore";
import { useEffect, useState } from "react";

// Dynamic imports
const Scene3D = dynamic(() => import("@/components/game/Scene"), {
  ssr: false,
  loading: () => <Loader />
});

const VirtualDesktop = dynamic(() => import("@/components/os/VirtualDesktop"), { ssr: false });
const StartScreen = dynamic(() => import("@/components/game/StartScreen"), { ssr: false });

export default function Home() {
  const isSitting = useGameStore((state) => state.isSitting);
  const gameStarted = useGameStore((state) => state.gameStarted);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // --- MODE 0: START SCREEN ---
  if (!gameStarted) {
    return <StartScreen />;
  }

  // --- MODE 1: COMPUTER (2D OS) ---
  if (isSitting) {
    return (
      // "fixed inset-0" forces this to cover the ENTIRE screen on top of everything
      <div className="fixed inset-0 z-50 w-screen h-screen bg-slate-900 overflow-hidden">
        <VirtualDesktop />

        {/* Exit Button */}
        <div className="absolute top-4 right-4 z-[100]">
          <button
            onClick={() => useGameStore.getState().setIsSitting(false)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded shadow-lg border border-red-400"
          >
            STAND UP (ESC)
          </button>
        </div>
      </div>
    );
  }

  // --- MODE 2: OFFICE (3D GAME) ---
  return (
    // "fixed inset-0" ensures the 3D canvas is never squashed by other elements
    <div className="fixed inset-0 z-0 w-screen h-screen bg-black">
      <Scene3D />

      {/* HUD Elements must be ABSOLUTE so they float ON TOP, not below */}
      <div className="absolute top-4 left-4 text-white/50 font-mono text-xs select-none pointer-events-none z-10">
        SATARK AI // SYSTEM ACTIVE
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => {
            // Return to Start Screen
            window.location.reload();
          }}
          className="text-xs text-red-500 hover:text-red-400 font-mono border border-red-900 bg-black/50 px-3 py-1 rounded hover:bg-red-900/20 transition-colors"
        >
          EXIT SESSION
        </button>
      </div>

      <div className="absolute bottom-8 left-8 text-white/70 font-mono text-sm pointer-events-none z-10 bg-black/50 p-2 rounded">
        [WASD] Move &nbsp; [MOUSE] Look &nbsp; [CLICK CHAIR] Use Computer
      </div>
    </div>
  );
}

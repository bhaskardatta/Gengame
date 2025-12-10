"use client";

import dynamic from "next/dynamic";
import { Loader } from "@react-three/drei";
import { useGameStore } from "@/stores/gameStore";
import VirtualDesktop from "@/components/os/VirtualDesktop";

// Dynamically import Scene to avoid SSR hydration mismatch
const Scene3D = dynamic(() => import("@/components/game/Scene"), {
  ssr: false,
  loading: () => <Loader />
});

export default function Home() {
  return (
    <main className="w-full h-full relative">
      <Scene3D />

      {/* HUD: Build Info */}
      <div className="absolute top-4 left-4 text-white font-mono pointer-events-none select-none z-10">
        <h1 className="text-2xl font-bold">PHISHNET 3D</h1>
        <p className="text-xs opacity-70">Development Build v0.3 (Stable)</p>
      </div>

      {/* Virtual OS Overlay */}
      <OverlayManager />
    </main>
  );
}

// Separate component to handle store subscription without re-rendering Scene
function OverlayManager() {
  const isSitting = useGameStore((state) => state.isSitting);

  if (!isSitting) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-[1200px] h-[800px] bg-black border-[10px] border-gray-800 rounded-lg shadow-2xl overflow-hidden">
        {/* Monitor Brand */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-900 flex items-center justify-center text-gray-500 text-xs tracking-widest z-50">
          PHISHNET CORP
        </div>

        {/* The OS */}
        <div className="w-full h-[calc(100%-32px)]">
          <VirtualDesktop />
        </div>

        {/* Exit Button overlay */}
        <div className="absolute top-4 right-4 z-[60]">
          <button
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-lg transition-all transform hover:scale-105"
            onClick={() => useGameStore.getState().setIsSitting(false)}
          >
            STAND UP (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}

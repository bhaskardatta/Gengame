"use client";

import dynamic from "next/dynamic";
import { Loader } from "@react-three/drei";
import { useGameStore } from "@/stores/gameStore";
import { useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Dynamically import Scene
const Scene3D = dynamic(() => import("@/components/game/Scene"), {
  ssr: false,
  loading: () => <Loader />
});

// Dynamically import VirtualDesktop
const VirtualDesktop = dynamic(() => import("@/components/os/VirtualDesktop"), { ssr: false });

export default function Home() {
  return (
    <main className="w-full h-full relative bg-black">
      <Scene3D />

      {/* HUD: Watermark */}
      <div className="absolute top-4 left-4 text-white/40 font-mono pointer-events-none select-none z-10">
        <h1 className="text-xl font-bold">PHISHNET 3D</h1>
        <p className="text-[10px]">ALPHA BUILD 0.4</p>
      </div>

      {/* Virtual OS Overlay - Manages the "Sitting" State */}
      <OverlayManager />
    </main>
  );
}

function OverlayManager() {
  const isSitting = useGameStore((state) => state.isSitting);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Do not render anything on server, wait for mount
  if (!mounted) return null;

  // VISIBILITY LOGIC:
  // If sitting, we show the Overlay. 
  // We use opacity transition for smoothness.

  if (!isSitting) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
      {/* The Monitor Container */}
      <div className="relative w-[90%] h-[90%] max-w-[1600px] max-h-[900px] bg-black border-[12px] border-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-gray-800">

        {/* Monitor Branding */}
        <div className="h-6 bg-gray-900 flex items-center justify-center shrink-0 border-b border-gray-800">
          <span className="text-gray-600 text-[10px] font-bold tracking-[0.3em] uppercase">PhishNet Corp</span>
        </div>

        {/* The OS Content */}
        <div className="flex-1 relative bg-black overflow-hidden">
          <ErrorBoundary>
            <VirtualDesktop />
          </ErrorBoundary>
        </div>

        {/* Exit Hint */}
        <div className="absolute top-0 right-0 p-4 pointer-events-auto">
          <button
            onClick={() => useGameStore.getState().setIsSitting(false)}
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded shadow-lg transition-transform hover:scale-105"
          >
            LEAVE DESK (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}

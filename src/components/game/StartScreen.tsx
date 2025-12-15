"use client";

import { useGameStore } from "@/stores/gameStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StartScreen() {
    const startGame = useGameStore((state) => state.startGame);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial system boot
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-center font-mono overflow-hidden">
            {/* Background Details */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scanline" />
                <div className="grid grid-cols-12 h-full w-full opacity-10">
                    {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-green-900" />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="z-10 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-800 drop-shadow-[0_0_15px_rgba(0,100,255,0.5)]">
                        SATARK AI
                    </h1>
                    <p className="text-blue-200 mt-4 tracking-widest text-sm md:text-base uppercase opacity-70">
                        Cyber Defense Simulation v2.0
                    </p>
                </motion.div>

                <div className="h-16 flex items-center justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, ease: "linear" }}
                                />
                            </div>
                            <p className="text-xs text-green-500 animate-pulse">Wait...</p>
                        </div>
                    ) : (
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startGame}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-none border-2 border-blue-400 tracking-widest uppercase transition-all"
                        >
                            Initialize
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-xs text-gray-500 tracking-widest">
                SECURE CONNECTION // ENCRYPTED
            </div>

            <style jsx global>{`
                @keyframes scanline {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
                .animate-scanline {
                    animation: scanline 4s linear infinite;
                }
            `}</style>
        </div>
    );
}

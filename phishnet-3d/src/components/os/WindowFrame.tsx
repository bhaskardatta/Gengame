"use client";

import { useOSStore, WindowState } from "@/stores/osStore";
import { X, Minus, Square, Minimize2 } from "lucide-react";
import { motion, useDragControls } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface WindowFrameProps {
    window: WindowState;
    children: React.ReactNode;
}

export default function WindowFrame({ window, children }: WindowFrameProps) {
    const { closeWindow, minimizeWindow, focusWindow } = useOSStore();
    const [isMaximized, setIsMaximized] = useState(false);
    const dragControls = useDragControls();

    // Track previous position to restore after maximize? 
    // Framer motion handles layout animations, but for drag it might be tricky.
    // simpler approach: toggle standard size vs full size.

    if (window.isMinimized) return null;

    return (
        <motion.div
            drag={!isMaximized}
            dragListener={false} // Only drag from handle
            dragControls={dragControls}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                width: isMaximized ? "100%" : "800px",
                height: isMaximized ? "100%" : "500px",
                top: isMaximized ? 0 : 50,
                left: isMaximized ? 0 : 100,
                x: isMaximized ? 0 : undefined, // Reset x/y on maximize
                // y: isMaximized ? 0 : undefined // This might conflict with drag position
            }}
            // We need to handle zIndex manually or via style constant because motion overrides transform
            style={{
                position: 'absolute',
                zIndex: window.zIndex,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
            className={`flex flex-col bg-slate-900 rounded-lg overflow-hidden border border-slate-700 ${isMaximized ? 'rounded-none border-none' : ''}`}
            onMouseDown={() => focusWindow(window.id)}
        >
            {/* Title Bar - Draggable Area */}
            <div
                onPointerDown={(e) => {
                    focusWindow(window.id);
                    dragControls.start(e);
                }}
                className="h-9 bg-slate-800 flex items-center justify-between px-3 border-b border-slate-700 select-none cursor-default active:cursor-grabbing"
            >
                <div className="flex items-center space-x-3">
                    {/* Traffic Lights */}
                    <div className="flex space-x-2 group">
                        <button
                            onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
                            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-transparent hover:text-black/50 transition-all"
                        >
                            <X size={8} strokeWidth={3} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
                            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-transparent hover:text-black/50 transition-all"
                        >
                            <Minus size={8} strokeWidth={3} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
                            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-transparent hover:text-black/50 transition-all"
                        >
                            {isMaximized ? <Minimize2 size={8} strokeWidth={3} /> : <Square size={8} strokeWidth={3} />}
                        </button>
                    </div>

                    {/* Title */}
                    <div className="h-4 w-[1px] bg-slate-700 mx-2" />
                    <span className="text-xs text-slate-300 font-medium tracking-wide flex items-center gap-2">
                        {window.title}
                    </span>
                </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
                {children}
            </div>
        </motion.div>
    );
}

"use client";

import { useOSStore, WindowState } from "@/stores/osStore";
import { X, Minus, Square } from "lucide-react";
import Draggable from "react-draggable";
import { useRef } from "react";

interface WindowFrameProps {
    window: WindowState;
    children: React.ReactNode;
}

export default function WindowFrame({ window, children }: WindowFrameProps) {
    const { closeWindow, minimizeWindow, focusWindow } = useOSStore();
    const nodeRef = useRef(null); // Required for react-draggable to avoid strict mode warnings

    if (window.isMinimized) return null;

    return (
        <Draggable
            handle=".window-header"
            bounds="parent"
            nodeRef={nodeRef}
            onMouseDown={() => focusWindow(window.id)}
        >
            <div
                ref={nodeRef}
                style={{ zIndex: window.zIndex }}
                className="absolute w-[900px] h-[600px] bg-[#f9f9f9] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-300 flex flex-col overflow-hidden font-segoe"
            >
                {/* Windows 11 Header */}
                <div className="window-header h-10 bg-[#f3f3f3] flex items-center justify-between px-2 select-none cursor-default border-b border-gray-200">
                    <div className="flex items-center gap-3 px-2">
                        {/* App Icon (Dynamic based on type) */}
                        <span className="text-xs font-semibold text-gray-700">{window.title}</span>
                    </div>

                    {/* Windows Controls */}
                    <div className="flex items-center">
                        <button
                            onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
                            className="w-10 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                        >
                            <Minus size={14} />
                        </button>
                        <button
                            className="w-10 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                        >
                            <Square size={12} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
                            className="w-10 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white relative overflow-hidden">
                    {children}
                </div>
            </div>
        </Draggable>
    );
}

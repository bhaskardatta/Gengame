"use client";

import { useOSStore } from "@/stores/osStore";
import { useGameStore } from "@/stores/gameStore";
import { useEffect, useState } from "react";
import WindowFrame from "./WindowFrame";
import { Mail, Globe, Terminal, Settings, Shield, MessageCircle, RefreshCw } from "lucide-react";

import MailApp from "../apps/MailApp";
import BrowserApp from "../apps/BrowserApp";
import TerminalApp from "../apps/TerminalApp";
import MessagesApp from "../apps/MessagesApp";

export default function VirtualDesktop() {
    const { windows, openWindow, toggleStartMenu, isStartMenuOpen } = useOSStore();
    const currentObjective = useGameStore(state => state.currentObjective);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="w-full h-full relative select-none font-sans overflow-hidden">
            {/* BACKGROUND: CSS Gradient (Failsafe) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-black z-0" />

            {/* Optional: Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:20px_20px] z-0" />

            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 grid grid-cols-1 gap-6 z-10">
                <DesktopIcon icon={<Mail size={24} />} label="CorpMail" color="bg-blue-600" onClick={() => openWindow('mail')} />
                <DesktopIcon icon={<Globe size={24} />} label="Intranet" color="bg-emerald-500" onClick={() => openWindow('browser')} />
                <DesktopIcon icon={<Terminal size={24} />} label="Terminal" color="bg-slate-700" onClick={() => openWindow('terminal')} />
                <DesktopIcon icon={<MessageCircle size={24} />} label="Chat" color="bg-green-500" onClick={() => openWindow('messages')} />
            </div>

            {/* Objective Widget (HUD) */}
            <div className="absolute top-4 right-4 w-72 bg-slate-900/90 border-l-4 border-blue-500 p-4 rounded shadow-2xl backdrop-blur z-10">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <RefreshCw size={12} className="animate-spin" /> Current Objective
                </h3>
                <p className="text-white text-sm font-medium leading-snug shadow-black drop-shadow-md">
                    {currentObjective}
                </p>
            </div>

            {/* Windows Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {windows.map((window) => (
                    <div key={window.id} className="pointer-events-auto">
                        <WindowFrame window={window}>
                            {window.type === 'mail' && <MailApp />}
                            {window.type === 'browser' && <BrowserApp />}
                            {window.type === 'terminal' && <TerminalApp />}
                            {window.type === 'messages' && <MessagesApp />}
                        </WindowFrame>
                    </div>
                ))}
            </div>

            {/* Taskbar */}
            <div className="absolute bottom-0 w-full h-12 bg-slate-950/95 border-t border-white/10 flex items-center justify-between px-3 z-50 backdrop-blur-xl">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={toggleStartMenu}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                        <div className="w-6 h-6 bg-blue-500 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                            <div className="bg-white rounded-[1px]" />
                            <div className="bg-white rounded-[1px]" />
                            <div className="bg-white rounded-[1px]" />
                            <div className="bg-white rounded-[1px]" />
                        </div>
                    </button>
                    {/* Open Windows Tabs */}
                    {windows.map(w => (
                        <div key={w.id} className="h-8 px-3 bg-white/5 border-b-2 border-blue-400 flex items-center gap-2 rounded-t text-xs text-white">
                            <span>{w.title}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-white">
                    <Shield size={16} className="text-green-400" />
                    <div className="text-right">
                        <div className="text-sm font-bold">{formatTime(time)}</div>
                    </div>
                </div>
            </div>

            {/* Start Menu */}
            {isStartMenuOpen && (
                <div className="absolute bottom-14 left-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-50">
                    <div className="text-xs text-gray-500 px-2 py-1 mb-1">Applications</div>
                    <StartMenuItem icon={<Mail size={16} />} label="Mail" onClick={() => openWindow('mail')} />
                    <StartMenuItem icon={<Globe size={16} />} label="Browser" onClick={() => openWindow('browser')} />
                    <StartMenuItem icon={<Terminal size={16} />} label="Terminal" onClick={() => openWindow('terminal')} />
                    <div className="h-[1px] bg-white/10 my-2" />
                    <StartMenuItem icon={<Settings size={16} />} label="Log Out" onClick={() => { }} danger />
                </div>
            )}
        </div>
    );
}

// Helper Components
const DesktopIcon = ({ icon, label, color, onClick }: any) => (
    <div className="flex flex-col items-center group cursor-pointer w-20" onDoubleClick={onClick}>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white`}>
            {icon}
        </div>
        <span className="text-white text-xs mt-2 bg-black/50 px-2 py-0.5 rounded backdrop-blur shadow text-center group-hover:bg-blue-600/80 transition-colors">
            {label}
        </span>
    </div>
);

const StartMenuItem = ({ icon, label, onClick, danger }: any) => (
    <button
        className={`w-full flex items-center gap-3 p-2 rounded hover:bg-white/10 transition-colors text-sm ${danger ? 'text-red-400 hover:bg-red-900/20' : 'text-slate-200'}`}
        onClick={onClick}
    >
        {icon}
        <span>{label}</span>
    </button>
);

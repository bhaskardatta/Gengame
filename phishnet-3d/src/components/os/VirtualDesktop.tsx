
"use client";

import { useOSStore } from "@/stores/osStore";
import { useGameStore } from "@/stores/gameStore";
import { useEffect, useState } from "react";
import WindowFrame from "./WindowFrame";
import { Mail, Globe, Terminal, Settings, Shield, MessageCircle } from "lucide-react";

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
        <div className="w-full h-full bg-slate-900 overflow-hidden relative select-none font-sans">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50" />

            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 grid grid-cols-1 gap-6">
                <div
                    className="flex flex-col items-center group cursor-pointer w-20"
                    onDoubleClick={() => openWindow('mail')}
                >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white">
                        <Mail size={24} />
                    </div>
                    <span className="text-white text-xs mt-2 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm text-center">Mail</span>
                </div>

                <div
                    className="flex flex-col items-center group cursor-pointer w-20"
                    onDoubleClick={() => openWindow('browser')}
                >
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white">
                        <Globe size={24} />
                    </div>
                    <span className="text-white text-xs mt-2 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm text-center">Browser</span>
                </div>

                <div
                    className="flex flex-col items-center group cursor-pointer w-20"
                    onDoubleClick={() => openWindow('terminal')}
                >
                    <div className="w-12 h-12 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white">
                        <Terminal size={24} />
                    </div>
                    <span className="text-white text-xs mt-2 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm text-center">Terminal</span>
                </div>

                <div
                    className="flex flex-col items-center group cursor-pointer w-20"
                    onDoubleClick={() => openWindow('messages')}
                >
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white">
                        <MessageCircle size={24} />
                    </div>
                    <span className="text-white text-xs mt-2 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm text-center">Messages</span>
                </div>
            </div>

            {/* Objective Widget */}
            <div className="absolute top-4 right-4 w-64 bg-slate-900/80 border-l-4 border-blue-500 p-4 rounded backdrop-blur-sm shadow-lg animate-in slide-in-from-right-10 duration-500">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Current Objective</h3>
                <p className="text-white text-sm font-medium leading-snug">
                    {currentObjective}
                </p>
            </div>

            {/* Windows Layer */}
            {windows.map((window) => (
                <WindowFrame key={window.id} window={window}>
                    {window.type === 'mail' && <MailApp />}
                    {window.type === 'browser' && <BrowserApp />}
                    {window.type === 'terminal' && <TerminalApp />}
                    {window.type === 'messages' && <MessagesApp />}
                </WindowFrame>
            ))}

            {/* Taskbar */}
            <div className="absolute bottom-0 w-full h-11 bg-slate-950/90 border-t border-white/5 flex items-center justify-between px-2 z-50 backdrop-blur-xl">
                <div className="flex items-center space-x-2">
                    {/* Start Button */}
                    <button
                        className={`p - 1.5 rounded - md transition - all ${isStartMenuOpen ? 'bg-white/10' : 'hover:bg-white/5'} `}
                        onClick={toggleStartMenu}
                    >
                        <div className="w-6 h-6 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-sm grid grid-cols-2 gap-0.5 p-[3px]">
                            <div className="bg-white/90 rounded-[1px]"></div>
                            <div className="bg-white/90 rounded-[1px]"></div>
                            <div className="bg-white/90 rounded-[1px]"></div>
                            <div className="bg-white/90 rounded-[1px]"></div>
                        </div>
                    </button>

                    {/* Taskbar Items */}
                    <div className="h-6 w-[1px] bg-white/10 mx-2" />

                    {/* Open Apps */}
                    {windows.map(w => (
                        <div key={w.id} className="w-8 h-8 bg-white/5 rounded flex items-center justify-center border-b-2 border-blue-500">
                            {w.type === 'mail' && <Mail size={16} className="text-blue-400" />}
                            {w.type === 'browser' && <Globe size={16} className="text-emerald-400" />}
                            {w.type === 'terminal' && <Terminal size={16} className="text-slate-400" />}
                            {w.type === 'messages' && <MessageCircle size={16} className="text-green-400" />}
                        </div>
                    ))}
                </div>

                {/* System Tray */}
                <div className="flex items-center space-x-3 px-2">
                    <Shield size={16} className="text-emerald-500" />
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-xs text-slate-200 font-medium">{formatTime(time)}</span>
                        <span className="text-xs text-slate-400">{time.toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Start Menu */}
            {isStartMenuOpen && (
                <div className="absolute bottom-12 left-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <div className="space-y-1">
                        <button className="w-full flex items-center space-x-3 p-2 hover:bg-white/10 rounded-md text-slate-200 text-sm transition-colors text-left" onClick={() => openWindow('mail')}>
                            <Mail size={18} className="text-blue-500" />
                            <span>Mail</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-2 hover:bg-white/10 rounded-md text-slate-200 text-sm transition-colors text-left" onClick={() => openWindow('browser')}>
                            <Globe size={18} className="text-emerald-500" />
                            <span>Browser</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-2 hover:bg-white/10 rounded-md text-slate-200 text-sm transition-colors text-left" onClick={() => openWindow('terminal')}>
                            <Terminal size={18} className="text-slate-400" />
                            <span>Terminal</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-2 hover:bg-white/10 rounded-md text-slate-200 text-sm transition-colors text-left" onClick={() => openWindow('messages')}>
                            <MessageCircle size={18} className="text-green-500" />
                            <span>Messages</span>
                        </button>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800">
                        <button className="w-full flex items-center space-x-3 p-2 hover:bg-red-500/10 rounded-md text-red-400 text-sm transition-colors text-left group">
                            <Settings size={18} />
                            <span className="group-hover:text-red-300">Shut Down</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


"use client";

import { useOSStore } from "@/stores/osStore";
import { useGameStore } from "@/stores/gameStore";
import { useEffect, useState } from "react";
import WindowFrame from "./WindowFrame";
import { Mail, Globe, Terminal, MessageCircle, Wifi, Volume2, Battery, Search, Power, ChevronUp, ShieldCheck, TrendingUp } from "lucide-react";

import MailApp from "../apps/MailApp";
import BrowserApp from "../apps/BrowserApp";
import TerminalApp from "../apps/TerminalApp";
import MessagesApp from "../apps/MessagesApp";
import GuardianApp from "../apps/GuardianApp";
import DashboardApp from "../apps/DashboardApp";

export default function VirtualDesktop() {
    const { windows, openWindow, toggleStartMenu, isStartMenuOpen } = useOSStore();
    const currentObjective = useGameStore(state => state.currentObjective);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

    return (
        <div className="w-full h-full relative overflow-hidden select-none font-segoe text-black cursor-default">

            {/* 1. WALLPAPER (Windows 11 Bloom Dark/Blue) */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1632213702844-1e0615781374?q=80&w=2532&auto=format&fit=crop')`, // Windows 11 Abstract
                }}
            />

            {/* 2. DESKTOP ICONS (Grid) */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <DesktopShortcut icon={<Mail className="text-blue-500 fill-blue-500" size={32} />} label="Outlook" onClick={() => openWindow('mail')} />
                <DesktopShortcut icon={<Globe className="text-emerald-500" size={32} />} label="Edge" onClick={() => openWindow('browser')} />
                <DesktopShortcut icon={<Terminal className="text-gray-700 fill-black" size={32} />} label="Terminal" onClick={() => openWindow('terminal')} />
                <DesktopShortcut icon={<MessageCircle className="text-green-500 fill-green-500" size={32} />} label="Teams" onClick={() => openWindow('messages')} />
                <DesktopShortcut icon={<ShieldCheck className="text-purple-500 fill-purple-900" size={32} />} label="Guardian" onClick={() => openWindow('guardian')} />
                <DesktopShortcut icon={<TrendingUp className="text-blue-600 fill-blue-900" size={32} />} label="Progress" onClick={() => openWindow('dashboard')} />
            </div>

            {/* 3. OBJECTIVE HUD (Game Overlay) */}
            <div className="absolute top-6 right-6 w-80 bg-black/60 backdrop-blur-md border border-white/10 text-white p-4 rounded-lg shadow-lg z-10">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">SECURITY TRAINING MODULE</h3>
                <p className="text-sm font-medium leading-relaxed">{currentObjective}</p>
            </div>

            {/* 4. WINDOWS LAYER */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {windows.map((window) => (
                    <div key={window.id} className="pointer-events-auto">
                        <WindowFrame window={window}>
                            {window.type === 'mail' && <MailApp />}
                            {window.type === 'browser' && <BrowserApp />}
                            {window.type === 'terminal' && <TerminalApp />}
                            {window.type === 'messages' && <MessagesApp />}
                            {window.type === 'guardian' && <GuardianApp />}
                            {window.type === 'dashboard' && <DashboardApp />}
                        </WindowFrame>
                    </div>
                ))}
            </div>

            {/* 5. TASKBAR (Windows 11 Centered) */}
            <div className="absolute bottom-0 w-full h-12 bg-[#f3f3f3]/85 backdrop-blur-xl border-t border-white/40 flex items-center justify-between px-4 z-50">

                {/* Widget Area (Left) */}
                <div className="w-1/3 flex items-center">
                    <div className="flex items-center gap-2 hover:bg-white/40 px-2 py-1 rounded transition-colors cursor-pointer">
                        <img src="https://openweathermap.org/img/wn/02d.png" className="w-8 h-8" alt="Weather" />
                        <div className="flex flex-col leading-none">
                            <span className="text-xs font-bold text-gray-700">72°F</span>
                            <span className="text-[10px] text-gray-500">Sunny</span>
                        </div>
                    </div>
                </div>

                {/* Center Icons (Start, Search, Apps) */}
                <div className="flex items-center gap-1.5">
                    <TaskbarIcon onClick={toggleStartMenu} active={isStartMenuOpen}>
                        <div className="grid grid-cols-2 gap-[2px] w-5 h-5">
                            <div className="bg-[#0078d4] w-full h-full rounded-[1px]"></div>
                            <div className="bg-[#0078d4] w-full h-full rounded-[1px]"></div>
                            <div className="bg-[#0078d4] w-full h-full rounded-[1px]"></div>
                            <div className="bg-[#0078d4] w-full h-full rounded-[1px]"></div>
                        </div>
                    </TaskbarIcon>

                    <div className="w-[1px] h-6 bg-gray-400/30 mx-1"></div>

                    <TaskbarIcon onClick={() => openWindow('mail')} isOpen={windows.some(w => w.type === 'mail')}>
                        <Mail className="text-blue-600" size={20} />
                    </TaskbarIcon>
                    <TaskbarIcon onClick={() => openWindow('browser')} isOpen={windows.some(w => w.type === 'browser')}>
                        <Globe className="text-emerald-500" size={20} />
                    </TaskbarIcon>
                    <TaskbarIcon onClick={() => openWindow('terminal')} isOpen={windows.some(w => w.type === 'terminal')}>
                        <Terminal className="text-gray-800" size={20} />
                    </TaskbarIcon>
                </div>

                {/* System Tray (Right) */}
                <div className="w-1/3 flex justify-end items-center gap-2">
                    <div className="flex items-center gap-3 px-2 py-1 hover:bg-white/40 rounded transition-colors cursor-pointer">
                        <ChevronUp size={14} className="text-gray-600" />
                        <Wifi size={16} className="text-gray-700" />
                        <Volume2 size={16} className="text-gray-700" />
                        <Battery size={16} className="text-gray-700" />
                    </div>
                    <div className="flex flex-col items-end leading-none px-2 py-1 hover:bg-white/40 rounded transition-colors cursor-pointer text-right">
                        <span className="text-xs font-medium text-gray-800">{formatTime(time)}</span>
                        <span className="text-[10px] text-gray-600">{formatDate(time)}</span>
                    </div>
                </div>
            </div>

            {/* 6. START MENU (Windows 11 Style) */}
            {isStartMenuOpen && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[600px] h-[700px] bg-[#f3f3f3]/95 backdrop-blur-2xl rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                    {/* Search */}
                    <div className="p-6 pb-2">
                        <div className="bg-white border-b-2 border-blue-500 h-10 rounded flex items-center px-4 gap-3 shadow-sm">
                            <Search size={18} className="text-gray-500" />
                            <input type="text" placeholder="Type here to search" className="bg-transparent outline-none text-sm w-full" />
                        </div>
                    </div>

                    {/* Pinned */}
                    <div className="flex-1 p-6 pt-2">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-gray-700">Pinned</span>
                            <button className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">All apps &gt;</button>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <StartMenuIcon icon={<Mail className="text-blue-500" size={24} />} label="Mail" onClick={() => openWindow('mail')} />
                            <StartMenuIcon icon={<Globe className="text-emerald-500" size={24} />} label="Edge" onClick={() => openWindow('browser')} />
                            <StartMenuIcon icon={<Terminal className="text-gray-800" size={24} />} label="Term" onClick={() => openWindow('terminal')} />
                            <StartMenuIcon icon={<MessageCircle className="text-purple-500" size={24} />} label="Teams" onClick={() => openWindow('messages')} />
                            <StartMenuIcon icon={<TrendingUp className="text-blue-600" size={24} />} label="Progress" onClick={() => openWindow('dashboard')} />
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="h-16 bg-[#e9e9e9] flex items-center justify-between px-8 border-t border-gray-300">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-xs">US</div>
                            <span className="text-xs font-bold text-gray-700">User</span>
                        </div>
                        <Power size={18} className="text-gray-600 hover:text-red-500 cursor-pointer" />
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Components (Styled for Windows 11)
const DesktopShortcut = ({ icon, label, onClick }: any) => (
    <div onClick={onClick} className="w-20 h-20 flex flex-col items-center justify-center gap-1 hover:bg-white/10 border border-transparent hover:border-white/20 rounded-sm cursor-pointer transition-colors group">
        <div className="drop-shadow-xl">{icon}</div>
        <span className="text-xs text-white text-shadow text-center leading-tight drop-shadow-md">{label}</span>
    </div>
);

const TaskbarIcon = ({ children, onClick, isOpen, active }: any) => (
    <div
        onClick={onClick}
        className={`w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/50 transition-all cursor-pointer relative ${active ? 'bg-white/50' : ''}`}
    >
        {children}
        {isOpen && <div className="absolute bottom-1 w-1.5 h-1 bg-gray-400 rounded-full"></div>}
    </div>
);

const StartMenuIcon = ({ icon, label, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 p-2 hover:bg-white/50 rounded transition-colors">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">{icon}</div>
        <span className="text-xs text-gray-700 font-medium">{label}</span>
    </button>
);

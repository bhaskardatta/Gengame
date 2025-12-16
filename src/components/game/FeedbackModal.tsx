"use client";

import { CheckCircle, XCircle, Trophy, TrendingUp, TrendingDown, ChevronRight, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { getLevelTitle } from "@/services/eloService";

interface FeedbackModalProps {
    isOpen: boolean;
    isCorrect: boolean;
    message: string;
    eloChange: { oldElo: number; newElo: number; levelUp: boolean };
    redFlags?: string[];
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, isCorrect, message, eloChange, redFlags, onClose }: FeedbackModalProps) {
    const [animateElo, setAnimateElo] = useState(eloChange.oldElo);

    useEffect(() => {
        if (isOpen) {
            const duration = 1500;
            const steps = 60;
            const stepDuration = duration / steps;
            const diff = eloChange.newElo - eloChange.oldElo;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);

                setAnimateElo(Math.round(eloChange.oldElo + (diff * ease)));

                if (currentStep >= steps) {
                    clearInterval(timer);
                    setAnimateElo(eloChange.newElo);
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }
    }, [isOpen, eloChange]);

    if (!isOpen) return null;

    const diff = eloChange.newElo - eloChange.oldElo;
    const isPositive = diff >= 0;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Banner */}
                <div className={`h-32 flex items-center justify-center relative overflow-hidden ${isCorrect ? 'bg-gradient-to-br from-green-500 to-emerald-700' : 'bg-gradient-to-br from-red-500 to-orange-600'}`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    {isCorrect ? (
                        <div className="flex flex-col items-center z-10 text-white">
                            <CheckCircle size={56} className="mb-2 drop-shadow-lg" />
                            <h2 className="text-3xl font-bold tracking-tight drop-shadow-md">Threat Neutralized</h2>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center z-10 text-white">
                            <XCircle size={56} className="mb-2 drop-shadow-lg" />
                            <h2 className="text-3xl font-bold tracking-tight drop-shadow-md">Security Critical</h2>
                        </div>
                    )}
                </div>

                <div className="p-8">

                    {/* ELO Rating Section */}
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 shadow-inner">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security Rating</span>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-black ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                    {animateElo}
                                </span>
                                <span className={`text-sm font-bold flex items-center ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                    {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                                    {diff > 0 ? '+' : ''}{diff}
                                </span>
                            </div>
                        </div>

                        {eloChange.levelUp && (
                            <div className="flex flex-col items-end animate-bounce">
                                <Trophy size={32} className="text-yellow-500 drop-shadow-sm mb-1" />
                                <span className="text-xs font-bold text-yellow-600 uppercase">Level Up!</span>
                            </div>
                        )}
                    </div>

                    {/* Analysis Section */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <FileSearchIcon /> Mission Analysis
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
                            {message}
                        </p>

                        {/* Red Flags List */}
                        {redFlags && redFlags.length > 0 && (
                            <div className="mt-4">
                                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 block">Detected Indicators</span>
                                <ul className="space-y-2">
                                    {redFlags.map((flag, idx) => (
                                        <li key={idx} className="flex items-start text-xs text-slate-700 bg-orange-50 px-3 py-2 rounded border border-orange-100">
                                            <AlertTriangle size={14} className="text-orange-500 mr-2 mt-0.5 shrink-0" />
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 hover:scale-[1.02] transition-all active:scale-95 shadow-lg group"
                    >
                        Adjusting Protocols <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

const FileSearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

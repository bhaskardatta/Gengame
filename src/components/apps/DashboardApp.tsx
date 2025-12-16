"use client";

import { useGameStore } from "@/stores/gameStore";
import { getLevelTitle, getLevel } from "@/services/eloService";
import { TrendingUp, Award, Activity, Shield } from "lucide-react";

export default function DashboardApp() {
    const { eloRating, score, objectivesCompleted, streak, matchHistory } = useGameStore();
    const currentLevel = getLevel(eloRating);

    // Calculate max rating for graph scaling
    const maxRating = Math.max(...matchHistory.map(m => m.rating), eloRating, 1000) + 100;
    const minRating = Math.min(...matchHistory.map(m => m.rating), eloRating, 800) - 100;

    return (
        <div className="h-full bg-slate-50 flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Security Dashboard</h1>
                    <p className="text-slate-500 text-sm">Real-time Employee Performance Analytics</p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full border border-indigo-100 font-bold text-sm">
                    <Activity size={16} />
                    Live Metrics
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {/* Top Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <StatCard
                        label="Current Rating"
                        value={eloRating}
                        icon={<TrendingUp size={20} className="text-white" />}
                        bg="bg-blue-600"
                    />
                    <StatCard
                        label="Rank Title"
                        value={getLevelTitle(currentLevel)}
                        icon={<Award size={20} className="text-white" />}
                        bg="bg-purple-600"
                        isText
                    />
                    <StatCard
                        label="Threats Neutralized"
                        value={objectivesCompleted}
                        icon={<Shield size={20} className="text-white" />}
                        bg="bg-emerald-600"
                    />
                    <StatCard
                        label="Training Streak"
                        value={streak}
                        icon={<Activity size={20} className="text-white" />}
                        bg="bg-orange-500"
                    />
                </div>

                {/* Graph Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-slate-400" />
                        Performance Trajectory (ELO)
                    </h3>

                    <div className="h-64 flex items-end justify-between gap-2 px-4 relative">
                        {/* Y-Axis Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between -z-10 text-xs text-slate-300 pointer-events-none">
                            <div className="border-t border-dashed border-slate-200 w-full pt-1 pl-1">{Math.round(maxRating)}</div>
                            <div className="border-t border-dashed border-slate-200 w-full pt-1 pl-1">{Math.round((maxRating + minRating) / 2)}</div>
                            <div className="border-t border-dashed border-slate-200 w-full pt-1 pl-1">{Math.round(minRating)}</div>
                        </div>

                        {matchHistory.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
                                Complete training scenarios to generate data.
                            </div>
                        ) : (
                            matchHistory.slice(-15).map((point, i) => {
                                const heightPercent = ((point.rating - minRating) / (maxRating - minRating)) * 100;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                        <div
                                            className={`w-full max-w-[40px] rounded-t-lg transition-all hover:opacity-80 relative ${point.result === 'Win' ? 'bg-emerald-500' : 'bg-red-500'}`}
                                            style={{ height: `${Math.max(5, heightPercent)}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                {point.rating} ELO
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-mono rotate-45 mt-2 origin-left">{point.date}</span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Recent History List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-700">Recent Activity Log</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {matchHistory.length === 0 && (
                            <div className="p-8 text-center text-slate-400">No activity recorded.</div>
                        )}
                        {[...matchHistory].reverse().slice(0, 5).map((match, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${match.result === 'Win' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                    <span className="font-medium text-slate-700 text-sm">Simulation #{matchHistory.length - i}</span>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <span className="text-slate-500 font-mono">{match.date}</span>
                                    <span className={`font-bold ${match.result === 'Win' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {match.result === 'Win' ? '+Win' : '-Loss'}
                                    </span>
                                    <div className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono w-16 text-center">
                                        {match.rating}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, icon, bg, isText }: any) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
        <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center shadow-md`}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`font-black text-slate-800 ${isText ? 'text-base leading-tight' : 'text-2xl'}`}>{value}</p>
        </div>
    </div>
);

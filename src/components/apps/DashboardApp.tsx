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

                    <div className="h-64 w-full relative">
                        {matchHistory.length < 2 && eloRating === 1000 ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                Complete at least 2 training scenarios to generate trajectory.
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                {/* SVG Chart */}
                                <svg className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid Lines (Background) */}
                                    <line x1="0" y1="0" x2="100%" y2="0" stroke="#e2e8f0" strokeDasharray="4 4" />
                                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e2e8f0" strokeDasharray="4 4" />
                                    <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#e2e8f0" strokeDasharray="4 4" />

                                    {/* The Line Path */}
                                    {(() => {
                                        // 1. Prepare Data Points
                                        // Include initial rating (1000) if history is short, or just use history
                                        const dataPoints = matchHistory.length > 0
                                            ? [...matchHistory]
                                            : [{ rating: 1000, date: 'Start', result: 'Win' }];

                                        // Limit to last 10 for readability
                                        const visibleData = dataPoints.slice(-10);

                                        // 2. Determine Scale
                                        const ratings = visibleData.map(d => d.rating);
                                        const min = Math.min(...ratings, 800) - 50;
                                        const max = Math.max(...ratings, 1200) + 50;
                                        const range = max - min;

                                        // 3. Map to Coordinates (percentage)
                                        const points = visibleData.map((d, i) => {
                                            const x = (i / (visibleData.length - 1 || 1)) * 100;
                                            const y = 100 - ((d.rating - min) / range) * 100;
                                            return { x, y, ...d };
                                        });

                                        // 4. Generate SVG Path Command
                                        const pathD = points.map((p, i) =>
                                            `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`
                                        ).join(' ');

                                        return (
                                            <>
                                                {/* Area Fill */}
                                                <path
                                                    d={`${pathD} L ${points[points.length - 1].x}% 100% L 0 100% Z`}
                                                    fill="url(#gradientLine)"
                                                    stroke="none"
                                                />
                                                {/* Stroke Line */}
                                                <path
                                                    d={pathD}
                                                    fill="none"
                                                    stroke="#4f46e5"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="drop-shadow-sm"
                                                />
                                                {/* Data Points */}
                                                {points.map((p, i) => (
                                                    <g key={i}>
                                                        <circle
                                                            cx={`${p.x}%`} cy={`${p.y}%`} r="6"
                                                            className={`fill-white stroke-2 ${p.result === 'Win' ? 'stroke-emerald-500' : 'stroke-red-500'} hover:r-8 transition-all cursor-pointer`}
                                                        />
                                                        {/* Tooltip on Hover (CSS group needed, simplest is always-on text for now or simple overlay) */}
                                                        <text
                                                            x={`${p.x}%`} y={`${p.y}%`} dy="-12"
                                                            textAnchor="middle"
                                                            className="text-[10px] fill-slate-500 font-bold opacity-0 hover:opacity-100 transition-opacity"
                                                        >
                                                            {p.rating}
                                                        </text>
                                                    </g>
                                                ))}
                                            </>
                                        );
                                    })()}
                                </svg>
                            </div>
                        )}

                        {/* Reference Labels (Absolute Overlay) */}
                        <div className="absolute inset-y-0 left-0 -ml-8 flex flex-col justify-between text-[10px] text-slate-400 font-mono py-1">
                            <span>High</span>
                            <span>Avg</span>
                            <span>Low</span>
                        </div>
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

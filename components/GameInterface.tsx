import React from 'react';
import { GameState, Scenario, UserStats, Difficulty } from '../types';
import { ScenarioRender } from './ScenarioRender';
import { Shield, ShieldAlert, Play, RefreshCw, BarChart2, Award, ChevronRight, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

interface GameInterfaceProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  stats: UserStats;
  currentScenario: Scenario | null;
  isLoading: boolean;
  lastResult: {correct: boolean, diff: number} | null;
  onDecision: (isPhishing: boolean) => void;
  onNext: () => void;
  onAbort: () => void;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  gameState,
  setGameState,
  stats,
  currentScenario,
  isLoading,
  lastResult,
  onDecision,
  onNext,
  onAbort
}) => {
  const getDifficulty = (elo: number): Difficulty => {
    if (elo < 1200) return Difficulty.NOVICE;
    if (elo < 1600) return Difficulty.INTERMEDIATE;
    return Difficulty.EXPERT;
  };

  if (gameState === GameState.MENU) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-transparent text-white p-12 select-none">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-white to-cyber-purple drop-shadow-[0_0_35px_rgba(188,19,254,0.6)] tracking-tighter">
            PHISH<span className="text-white">NET</span>
          </h1>
          <p className="text-3xl text-cyber-blue/80 font-mono tracking-[0.5em] uppercase animate-pulse">
            Neural Social Engineering Simulator
          </p>
        </div>
        
        <button 
          onClick={() => setGameState(GameState.PLAYING)}
          className="group relative px-16 py-8 bg-cyber-blue/5 border-2 border-cyber-blue text-cyber-blue font-mono font-bold text-3xl uppercase tracking-widest hover:bg-cyber-blue hover:text-black transition-all duration-300"
        >
          <div className="absolute inset-0 bg-cyber-blue/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          <span className="flex items-center gap-6 relative z-10">
            <Play size={40} className="fill-current" /> INITIALIZE SYSTEM
          </span>
        </button>

        <div className="mt-24 grid grid-cols-3 gap-12 w-full max-w-5xl opacity-80">
          <div className="p-8 border border-white/10 bg-black/40 rounded-xl backdrop-blur-sm">
            <Zap size={48} className="mx-auto mb-4 text-yellow-400" />
            <h3 className="font-bold text-2xl mb-2">Dynamic Threats</h3>
            <p className="text-lg text-gray-400">Gemini AI generates unique attack vectors in real-time.</p>
          </div>
          <div className="p-8 border border-white/10 bg-black/40 rounded-xl backdrop-blur-sm">
            <ShieldCheck size={48} className="mx-auto mb-4 text-green-400" />
            <h3 className="font-bold text-2xl mb-2">Digital Guardian</h3>
            <p className="text-lg text-gray-400">RAG-powered AI assistant analyzes content with you.</p>
          </div>
          <div className="p-8 border border-white/10 bg-black/40 rounded-xl backdrop-blur-sm">
            <BarChart2 size={48} className="mx-auto mb-4 text-cyber-purple" />
            <h3 className="font-bold text-2xl mb-2">Ranked ELO</h3>
            <p className="text-lg text-gray-400">Climb the global cybersecurity leaderboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === GameState.EVALUATION && lastResult && currentScenario) {
     return (
        <div className="h-full w-full flex items-center justify-center p-12 bg-black/80">
            <div className="bg-[#0a0a0f] border border-gray-700 rounded-3xl shadow-2xl max-w-4xl w-full p-12 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-4 ${lastResult.correct ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_50px_rgba(0,0,0,1)]`}></div>
                
                <div className="flex flex-col items-center text-center mb-10">
                    {lastResult.correct ? (
                        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border-2 border-green-500">
                            <Award className="text-green-400" size={56} />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border-2 border-red-500">
                            <ShieldAlert className="text-red-400" size={56} />
                        </div>
                    )}
                    
                    <h2 className={`text-6xl font-black uppercase ${lastResult.correct ? 'text-green-400' : 'text-red-500'}`}>
                        {lastResult.correct ? 'Threat Neutralized' : 'Security Breach'}
                    </h2>
                    <div className="mt-4 text-gray-400 font-mono text-xl">
                        ELO UPDATE: <span className={lastResult.diff > 0 ? 'text-green-400' : 'text-red-400'}>{lastResult.diff > 0 ? '+' : ''}{lastResult.diff}</span>
                    </div>
                </div>

                <div className="space-y-8 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                    <div>
                        <h3 className="text-cyber-blue font-bold uppercase text-sm tracking-widest mb-3 border-b border-gray-700 pb-2">Analysis</h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {currentScenario.explanation}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {currentScenario.isPhishing && (
                            <div>
                                <h3 className="text-red-400 font-bold uppercase text-sm tracking-widest mb-3 border-b border-gray-700 pb-2">Red Flags</h3>
                                <ul className="space-y-3">
                                    {currentScenario.redFlags.map((flag, i) => (
                                        <li key={i} className="flex items-center gap-3 text-base text-gray-300 bg-red-900/10 p-2 rounded">
                                            <AlertTriangle className="text-red-500 shrink-0" size={18} />
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {!currentScenario.isPhishing && (
                             <div>
                                <h3 className="text-green-400 font-bold uppercase text-sm tracking-widest mb-3 border-b border-gray-700 pb-2">Safe Markers</h3>
                                <ul className="space-y-3">
                                    {currentScenario.safeFactors.map((flag, i) => (
                                        <li key={i} className="flex items-center gap-3 text-base text-gray-300 bg-green-900/10 p-2 rounded">
                                            <ShieldCheck className="text-green-500 shrink-0" size={18} />
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 flex justify-center">
                    <button 
                        onClick={onNext}
                        className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-xl font-bold text-xl hover:bg-cyber-blue transition-colors shadow-lg hover:shadow-cyber-blue/50"
                    >
                        Next Simulation <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
     );
  }

  // PLAYING STATE
  return (
    <div className="h-full w-full flex flex-col p-8 bg-gradient-to-br from-[#0a0a0f] to-[#050505]">
      {/* Header Stats */}
      <header className="flex justify-between items-center mb-8 glass-panel p-6 rounded-2xl border-l-8 border-cyber-blue">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
             <span className="text-xs uppercase text-gray-400 tracking-wider mb-1">Operator ELO</span>
             <span className="text-4xl font-mono font-bold text-white flex items-center gap-3">
               {stats.elo} <span className="text-sm text-black bg-cyber-green px-2 py-1 rounded font-bold">{getDifficulty(stats.elo)}</span>
             </span>
          </div>
          <div className="w-px h-12 bg-gray-700"></div>
          <div className="flex flex-col">
             <span className="text-xs uppercase text-gray-400 tracking-wider mb-1">Streak</span>
             <span className="text-4xl font-mono font-bold text-cyber-purple">{stats.streak}x</span>
          </div>
        </div>
        <button onClick={onAbort} className="text-sm text-gray-500 hover:text-red-400 uppercase font-bold tracking-widest transition-colors border border-gray-700 px-4 py-2 rounded hover:border-red-400">
            Abort Session
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center glass-panel rounded-3xl border border-cyber-blue/20">
              <div className="relative">
                <div className="absolute inset-0 bg-cyber-blue blur-xl opacity-20 animate-pulse"></div>
                <RefreshCw className="animate-spin text-cyber-blue mb-8 relative z-10" size={80} />
              </div>
              <p className="font-mono text-2xl text-cyber-blue animate-pulse tracking-widest">GENERATING THREAT VECTOR...</p>
              <p className="text-sm text-gray-500 mt-2 font-mono">Gemini Model 2.5 Flash // Synthesizing Context</p>
            </div>
          ) : currentScenario ? (
            <div className="flex-1 flex gap-8 h-full">
                 {/* Scenario Container */}
                 <div className="flex-1 flex flex-col">
                     <div className="flex-1 overflow-hidden relative rounded-3xl shadow-2xl border border-gray-800 bg-black/50">
                        <ScenarioRender scenario={currentScenario} />
                     </div>

                     {/* Action Bar */}
                     <div className="h-28 mt-8 flex gap-6">
                        <button 
                            onClick={() => onDecision(false)}
                            className="flex-1 bg-green-900/20 hover:bg-green-600 border-2 border-green-500/50 hover:border-green-400 text-green-400 hover:text-white rounded-2xl flex flex-col items-center justify-center transition-all group shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                        >
                            <Shield size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-xl tracking-widest">LEGITIMATE</span>
                        </button>
                        <button 
                             onClick={() => onDecision(true)}
                             className="flex-1 bg-red-900/20 hover:bg-red-600 border-2 border-red-500/50 hover:border-red-400 text-red-400 hover:text-white rounded-2xl flex flex-col items-center justify-center transition-all group shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]"
                        >
                            <ShieldAlert size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-xl tracking-widest">PHISHING</span>
                        </button>
                     </div>
                 </div>
            </div>
          ) : null}
      </div>
    </div>
  );
};

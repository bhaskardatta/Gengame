import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scenario, UserStats, GameState, Difficulty } from './types';
import { generateScenario } from './services/geminiService';
import { Scene3D } from './components/Scene3D';

const INITIAL_STATS: UserStats = {
  elo: 1000,
  streak: 0,
  scenariosCompleted: 0,
  accuracy: 0,
  badges: []
};

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{correct: boolean, diff: number} | null>(null);

  // Difficulty Logic
  const getDifficulty = (elo: number): Difficulty => {
    if (elo < 1200) return Difficulty.NOVICE;
    if (elo < 1600) return Difficulty.INTERMEDIATE;
    return Difficulty.EXPERT;
  };

  // Game Loop Logic
  useEffect(() => {
    if (gameState === GameState.PLAYING && !currentScenario && !isLoading) {
        loadNextScenario();
    }
  }, [gameState]);

  const loadNextScenario = async () => {
    setIsLoading(true);
    setLastResult(null);
    const difficulty = getDifficulty(stats.elo);
    const scenario = await generateScenario(difficulty, stats.elo);
    setCurrentScenario(scenario);
    setIsLoading(false);
  };

  const handleDecision = (userThoughtPhishing: boolean) => {
    if (!currentScenario) return;

    const isCorrect = userThoughtPhishing === currentScenario.isPhishing;
    
    // ELO Calculation
    const K = 32;
    const expectedScore = 1 / (1 + 10 ** ((1500 - stats.elo) / 400));
    const actualScore = isCorrect ? 1 : 0;
    const eloChange = Math.round(K * (actualScore - expectedScore)) + (isCorrect ? 10 : -10);
    
    const newElo = Math.max(0, stats.elo + eloChange);
    const newStreak = isCorrect ? stats.streak + 1 : 0;
    const newTotal = stats.scenariosCompleted + 1;
    const prevCorrect = (stats.accuracy / 100) * stats.scenariosCompleted;
    const newAccuracy = ((prevCorrect + (isCorrect ? 1 : 0)) / newTotal) * 100;

    setStats({
      ...stats,
      elo: newElo,
      streak: newStreak,
      scenariosCompleted: newTotal,
      accuracy: newAccuracy
    });

    setLastResult({ correct: isCorrect, diff: eloChange });
    setGameState(GameState.EVALUATION);
  };

  const handleNext = () => {
    setGameState(GameState.PLAYING);
    loadNextScenario();
  };

  return (
    <div className="w-full h-screen bg-black relative">
       {/* 3D Canvas Host */}
       <Canvas shadows dpr={[1, 2]} className="w-full h-full">
          <Suspense fallback={null}>
            <Scene3D 
              gameState={gameState}
              setGameState={setGameState}
              stats={stats}
              currentScenario={currentScenario}
              isLoading={isLoading}
              lastResult={lastResult}
              onDecision={handleDecision}
              onNext={handleNext}
              onAbort={() => setGameState(GameState.MENU)}
            />
          </Suspense>
       </Canvas>

       {/* Overlay for small version number */}
       <div className="absolute bottom-2 right-4 z-50 text-[10px] text-gray-600 font-mono pointer-events-none select-none">
         PHISHNET SIMULATION v2.0.1 // 3D IMMERSIVE
       </div>
    </div>
  );
}

export default App;
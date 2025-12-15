import { create } from 'zustand';

interface GameState {
    isSitting: boolean;
    score: number;
    day: number;
    gameStarted: boolean;
    currentObjective: string;
    setIsSitting: (sitting: boolean) => void;
    incrementScore: (amount: number) => void;
    nextDay: () => void;
    setCurrentObjective: (objective: string) => void;
    startGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    isSitting: false,
    score: 1000,
    day: 1,
    gameStarted: false,
    currentObjective: "Check your email for onboarding instructions.",
    setIsSitting: (sitting) => set({ isSitting: sitting }),
    incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
    nextDay: () => set((state) => ({ day: state.day + 1 })),
    setCurrentObjective: (objective) => set({ currentObjective: objective }),
    startGame: () => set({ gameStarted: true }),
}));



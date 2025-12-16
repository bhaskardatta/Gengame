import { create } from 'zustand';
import { calculateElo, getLevel } from '@/services/eloService';

interface GameState {
    // Original State
    isSitting: boolean;
    score: number;
    day: number;
    gameStarted: boolean;
    currentObjective: string;

    // New ELO State
    eloRating: number;
    level: number;
    objectivesCompleted: number;
    streak: number;
    matchHistory: { date: string; rating: number; result: 'Win' | 'Loss' }[];

    // Actions
    setIsSitting: (sitting: boolean) => void;
    incrementScore: (amount: number) => void;
    nextDay: () => void;
    setCurrentObjective: (objective: string) => void;
    startGame: () => void;
    updateElo: (difficulty: 'Novice' | 'Intermediate' | 'Expert', isCorrect: boolean) => { oldElo: number; newElo: number; levelUp: boolean };
}

export const useGameStore = create<GameState>((set, get) => ({
    // Initial State
    isSitting: false,
    score: 0,
    day: 1,
    gameStarted: false,
    currentObjective: "Sit at the desk to begin.",
    eloRating: 1000,
    level: 2, // Starts at Apprentice (1000)
    objectivesCompleted: 0,
    streak: 0,
    matchHistory: [],

    // Actions
    setIsSitting: (sitting) => set({ isSitting: sitting }),
    startGame: () => set({ gameStarted: true }),
    nextDay: () => set((state) => ({ day: state.day + 1 })),
    incrementScore: (amount) => set((state) => ({ score: state.score + amount })),

    updateElo: (difficulty, isCorrect) => {
        const { eloRating, streak, matchHistory, level: oldLevel } = get(); // Capture old level before set
        const newElo = calculateElo(eloRating, difficulty, isCorrect);
        const newLevel = getLevel(newElo);
        const newStreak = isCorrect ? streak + 1 : 0;

        // Record history
        const newHistoryItem = { date: new Date().toLocaleTimeString(), rating: newElo, result: isCorrect ? 'Win' : 'Loss' } as const;
        const newHistory = [...matchHistory, newHistoryItem];

        set({
            eloRating: newElo,
            level: newLevel,
            streak: newStreak,
            matchHistory: newHistory
        });

        return { oldElo: eloRating, newElo, levelUp: newLevel > get().level };
    },

    setCurrentObjective: (objective) => set((state) => {
        // If the objective changes to something "completed" sounding, increment count
        if (objective.includes("Verified") || objective.includes("Blocked") || objective.includes("Done")) {
            return {
                currentObjective: objective,
                objectivesCompleted: state.objectivesCompleted + 1
            };
        }
        return { currentObjective: objective };
    }),
}));

import { create } from 'zustand';

export interface GameTask {
    id: string;
    description: string;
    completed: boolean;
    reward: number; // Reputation points
    isCritical?: boolean; // Essential to proceed to next day
}

interface TaskState {
    tasks: GameTask[];
    // Actions
    addTask: (task: GameTask) => void;
    completeTask: (taskId: string) => void;
    setTasks: (tasks: GameTask[]) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [
        {
            id: 'day1-01',
            description: 'Check your email for onboarding instructions.',
            completed: false,
            reward: 50,
            isCritical: true
        }
    ],

    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

    completeTask: (taskId) => set((state) => ({
        tasks: state.tasks.map(t =>
            t.id === taskId ? { ...t, completed: true } : t
        )
    })),

    setTaskCritical: (id: string, critical: boolean) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, isCritical: critical } : t))
    })),

    setTasks: (tasks) => set({ tasks })
}));



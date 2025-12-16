import { create } from 'zustand';

export interface WindowState {
    id: string;
    title: string;
    type: 'mail' | 'browser' | 'terminal' | 'settings' | 'messages' | 'guardian' | 'dashboard';
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
}

interface OSState {
    windows: WindowState[];
    isStartMenuOpen: boolean;

    // Actions
    openWindow: (type: WindowState['type']) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    toggleStartMenu: () => void;
}

export const useOSStore = create<OSState>((set, get) => ({
    windows: [],
    isStartMenuOpen: false,

    openWindow: (type) => {
        const { windows } = get();
        // Bring to front if already open
        const existing = windows.find(w => w.type === type);
        if (existing) {
            get().focusWindow(existing.id);
            return;
        }

        const maxZ = Math.max(0, ...windows.map(w => w.zIndex));
        const newWindow: WindowState = {
            id: crypto.randomUUID(),
            type,
            title: type === 'mail' ? 'CorpMail' : type === 'browser' ? 'PhishNet Intranet' : type === 'guardian' ? 'Digital Guardian' : type.charAt(0).toUpperCase() + type.slice(1),
            isOpen: true,
            isMinimized: false,
            zIndex: maxZ + 1
        };
        set({ windows: [...windows, newWindow], isStartMenuOpen: false });
    },

    closeWindow: (id) => set(state => ({
        windows: state.windows.filter(w => w.id !== id)
    })),

    minimizeWindow: (id) => set(state => ({
        windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)
    })),

    focusWindow: (id) => set(state => {
        const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
        return {
            windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w)
        };
    }),

    toggleStartMenu: () => set(state => ({ isStartMenuOpen: !state.isStartMenuOpen }))
}));

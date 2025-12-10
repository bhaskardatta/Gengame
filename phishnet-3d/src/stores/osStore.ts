import { create } from 'zustand';

export interface WindowState {
    id: string;
    title: string;
    type: 'mail' | 'browser' | 'terminal' | 'settings' | 'explorer' | 'messages';
    isOpen: boolean;
    isMinimized: boolean;
    content?: any;
    zIndex: number;
}

interface OSState {
    windows: WindowState[];
    activeWindowId: string | null;
    isStartMenuOpen: boolean;

    // Actions
    openWindow: (type: WindowState['type'], data?: any) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    toggleStartMenu: () => void;
    setStartMenu: (isOpen: boolean) => void;
}

export const useOSStore = create<OSState>((set, get) => ({
    windows: [],
    activeWindowId: null,
    isStartMenuOpen: false,

    openWindow: (type, data) => {
        const windows = get().windows;
        // Check if window of this type already exists (for single instance apps)
        // For now, let's allow multiple unless it's unique like 'settings'

        const newWindow: WindowState = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            title: type.charAt(0).toUpperCase() + type.slice(1),
            isOpen: true,
            isMinimized: false,
            content: data,
            zIndex: windows.length + 1
        };

        set({
            windows: [...windows, newWindow],
            activeWindowId: newWindow.id,
            isStartMenuOpen: false // Close start menu on launch
        });
    },

    closeWindow: (id) => {
        set((state) => ({
            windows: state.windows.filter(w => w.id !== id),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
        }));
    },

    minimizeWindow: (id) => {
        set((state) => ({
            windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
            activeWindowId: null
        }));
    },

    focusWindow: (id) => {
        set((state) => {
            const maxZ = Math.max(...state.windows.map(w => w.zIndex), 0);
            return {
                windows: state.windows.map(w => w.id === id
                    ? { ...w, zIndex: maxZ + 1, isMinimized: false }
                    : w),
                activeWindowId: id
            };
        });
    },

    toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
    setStartMenu: (isOpen) => set({ isStartMenuOpen: isOpen }),
}));



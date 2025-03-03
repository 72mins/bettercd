import { create } from 'zustand';

interface CommandStore {
    open: boolean;
    setOpen: (open: boolean) => void;

    openCommand: () => void;
    closeCommand: () => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),

    openCommand: () => set({ open: true }),
    closeCommand: () => set({ open: false }),
}));

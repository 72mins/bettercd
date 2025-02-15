import { fetchTokens, removeTokens } from '@/lib/localStorage';
import { create } from 'zustand';

interface TokenType {
    access: string | null;
    refresh: string | null;
}

interface AuthStore extends TokenType {
    setAll: (data: TokenType) => void;
    setAccessToken: (access: string) => void;
    setRefreshToken: (refresh: string) => void;
    logout: () => void;
}

const tokens = fetchTokens();

export const useAuthStore = create<AuthStore>((set) => ({
    access: tokens?.access || null,
    refresh: tokens?.refresh || null,

    setAll: (data: TokenType) => set(data),
    setAccessToken: (access: string) => set({ access }),
    setRefreshToken: (refresh: string) => set({ refresh }),

    logout: () => {
        removeTokens();

        set({ access: null, refresh: null });
    },
}));

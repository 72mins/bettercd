import { fetchTokens } from '@/lib/localStorage';
import { create } from 'zustand';

interface TokenType {
    access: string;
    refresh: string;
}

interface AuthStore extends TokenType {
    setAll: (data: TokenType) => void;
    setAccessToken: (access: string) => void;
    setRefreshToken: (refresh: string) => void;
}

const tokens = fetchTokens();

export const useAuthStore = create<AuthStore>((set) => ({
    access: tokens?.access || null,
    refresh: tokens?.refresh || null,

    setAll: (data: TokenType) => set(data),
    setAccessToken: (access: string) => set({ access }),
    setRefreshToken: (refresh: string) => set({ refresh }),
}));

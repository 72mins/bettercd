import { GithubProfile } from '@/services/integrations/github';
import { create } from 'zustand';

interface GithubStore {
    profile: GithubProfile | null;
    setProfile: (profile: GithubProfile | null) => void;
    clearProfile: () => void;
}

export const useGithubStore = create<GithubStore>((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    clearProfile: () => set({ profile: null }),
}));

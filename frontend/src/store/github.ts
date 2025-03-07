import { GithubProfile, Repository } from '@/services/integrations/github';
import { create } from 'zustand';

interface GithubStore {
    profile: GithubProfile | null;
    setProfile: (profile: GithubProfile | null) => void;
    clearProfile: () => void;

    repositories: Repository[] | null;
    setRepositories: (repositories: Repository[] | null) => void;
}

export const useGithubStore = create<GithubStore>((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    clearProfile: () => set({ profile: null }),

    repositories: null,
    setRepositories: (repositories) => set({ repositories }),
}));

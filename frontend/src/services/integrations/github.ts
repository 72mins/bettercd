import { axiosInstance } from '@/axios';
import { useQuery } from '@tanstack/react-query';

export interface GithubProfile {
    id: number;
    github_user_id: string;
    github_username: string;
    user: number;
}

interface Branch {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
}

export interface Repository {
    id: number;
    name: string;
    branches: Branch[];
}

const fetchGithubProfile = async (): Promise<GithubProfile> => {
    const res = await axiosInstance.get('/github/profile/');

    return res.data;
};

export const useFetchGithubProfile = () => {
    return useQuery<GithubProfile, Error>({
        queryKey: ['github-profile'],
        queryFn: fetchGithubProfile,
    });
};

const fetchRepositories = async (): Promise<Repository[]> => {
    const res = await axiosInstance.get('/github/repositories/');

    return res.data;
};

export const useFetchRepositories = (profileId: string | undefined) => {
    return useQuery<Repository[], Error>({
        queryKey: ['github-repositories'],
        queryFn: fetchRepositories,
        enabled: !!profileId,
    });
};

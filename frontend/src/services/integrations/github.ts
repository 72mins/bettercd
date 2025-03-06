import { axiosInstance } from '@/axios';
import { useQuery } from '@tanstack/react-query';

export interface GithubProfile {
    id: number;
    github_user_id: string;
    github_username: string;
    user: number;
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

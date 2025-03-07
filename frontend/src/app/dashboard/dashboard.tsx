import { useEffect } from 'react';
import { Outlet } from 'react-router';

import SectionLayout from '@/components/navigation/layout';
import { useFetchGithubProfile, useFetchRepositories } from '@/services/integrations/github';
import { useGithubStore } from '@/store/github';

export default function DashboardPage() {
    const { profile, setProfile, setRepositories } = useGithubStore();

    const { data, isSuccess } = useFetchGithubProfile();
    const { data: repositories, isSuccess: repoSuccess } = useFetchRepositories(profile?.github_user_id);

    useEffect(() => {
        if (data && isSuccess) {
            setProfile(data);
        }
    }, [data, isSuccess, setProfile]);

    useEffect(() => {
        if (repositories && repoSuccess) {
            setRepositories(repositories);
        }
    }, [repositories, repoSuccess, setRepositories]);

    return (
        <SectionLayout>
            <Outlet />
        </SectionLayout>
    );
}

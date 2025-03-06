import { useEffect } from 'react';
import { Outlet } from 'react-router';

import SectionLayout from '@/components/navigation/layout';
import { useFetchGithubProfile } from '@/services/integrations/github';
import { useGithubStore } from '@/store/github';

export default function DashboardPage() {
    const { setProfile } = useGithubStore();
    const { data, isSuccess } = useFetchGithubProfile();

    useEffect(() => {
        if (data && isSuccess) {
            setProfile(data);
        }
    }, [data, isSuccess, setProfile]);

    return (
        <SectionLayout>
            <Outlet />
        </SectionLayout>
    );
}

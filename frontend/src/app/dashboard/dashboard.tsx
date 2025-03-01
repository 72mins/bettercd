import { Outlet } from 'react-router';

import SectionLayout from '@/components/navigation/layout';

export default function DashboardPage() {
    return (
        <SectionLayout>
            <Outlet />
        </SectionLayout>
    );
}

import { NavLink } from 'react-router';

import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface NavItem {
    title: string;
    url: string;
}

const navItems: NavItem[] = [
    {
        title: 'Pipelines',
        url: '/dashboard/ci-cd/pipelines',
    },
    {
        title: ' History',
        url: '/dashboard/ci-cd/build-history',
    },
    {
        title: 'Integrations',
        url: '/dashboard/integrations',
    },
];

const NavigationBar = () => {
    return (
        <>
            <div className="flex justify-between h-12">
                <ScrollArea>
                    <div className="h-12 ml-0 flex space-x-8">
                        {navItems.map((item) => {
                            const { title, url } = item;

                            return (
                                <NavLink
                                    key={title}
                                    className="text-muted-foreground hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 focus:outline-none focus:text-primary focus:border-border transition duration-150 ease-in-out [&.active]:border-b-2 [&.active]:border-primary [&.active]:text-primary"
                                    to={url}
                                >
                                    {title}
                                </NavLink>
                            );
                        })}
                        <ScrollBar orientation="horizontal" />
                    </div>
                </ScrollArea>
            </div>
        </>
    );
};

export default NavigationBar;

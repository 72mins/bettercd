import { useNavigate } from 'react-router';

import { LogOut, MonitorCog, Moon, Palette, Sun } from 'lucide-react';

import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from '../ui/dropdown-menu';
import NavigationBar from './navbar';
import { useAuthStore } from '@/store/auth';
import { useTheme } from '../theme/theme-provider';

const SectionLayout = ({ children }: { children: React.ReactNode }) => {
    const { setTheme } = useTheme();
    const navigate = useNavigate();

    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();

        navigate('/');
    };

    return (
        <>
            <nav className="bg-background border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="logo-text">BetterCD</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="size-10 cursor-pointer">
                                        <AvatarFallback className="text-sm">RG</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Palette />
                                            Theme
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => setTheme('light')}>
                                                    <Sun />
                                                    Light
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme('dark')}>
                                                    <Moon />
                                                    Dark
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme('system')}>
                                                    <MonitorCog />
                                                    System
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NavigationBar />
                </div>
            </nav>
            {children}
        </>
    );
};

export default SectionLayout;

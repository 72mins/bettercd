import { useCallback } from 'react';

import { cn } from '@/lib/utils';
import { useTheme } from '../theme/theme-provider';

type Status = 'success' | 'failure' | 'pending' | 'unknown';

const getStatusColor = (status: Status) => {
    switch (status) {
        case 'success':
            return 'bg-green-400';
        case 'failure':
            return 'bg-red-400';
        case 'pending':
            return 'bg-yellow-400';
        default:
            return 'bg-gray-400';
    }
};

const getBgColor = (status: Status, theme: string) => {
    const shade = theme === 'light' ? '100' : '600';

    switch (status) {
        case 'success':
            return `bg-green-${shade}`;
        case 'failure':
            return `bg-red-${shade}`;
        case 'pending':
            return `bg-yellow-${shade}`;
        default:
            return `bg-gray-${shade}`;
    }
};

const StatusDot = ({ status }: { status: Status }) => {
    const { theme } = useTheme();

    const getStatusBackground = useCallback(() => getBgColor(status, theme), [status, theme]);

    return (
        <div className={cn('relative mb-[-3px] h-4 w-4 flex-shrink-0', status === 'pending' && 'animate-pulse')}>
            <div className={cn('absolute inset-0 rounded-full', getStatusBackground())}></div>
            <div className={cn('absolute inset-[4px] rounded-full', getStatusColor(status))}></div>
        </div>
    );
};

export default StatusDot;

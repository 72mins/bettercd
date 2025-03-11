/**
 * Returns a compact relative time string (e.g., "2h ago", "5m ago", "8sec ago")
 * @param dateString A string representing a date/time
 * @returns A string representing the relative time in compact format
 */
export const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return 'N/A';
    }

    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
        { seconds: 31536000, label: 'y' },
        { seconds: 2592000, label: 'mo' },
        { seconds: 604800, label: 'w' },
        { seconds: 86400, label: 'd' },
        { seconds: 3600, label: 'h' },
        { seconds: 60, label: 'm' },
        { seconds: 1, label: 'sec' },
    ];

    if (secondsAgo < 0) {
        return 'in future';
    }

    if (secondsAgo < 5) {
        return 'just now';
    }

    for (const interval of intervals) {
        const value = Math.floor(secondsAgo / interval.seconds);

        if (value >= 1) {
            return `${value}${interval.label} ago`;
        }
    }

    return 'just now';
};

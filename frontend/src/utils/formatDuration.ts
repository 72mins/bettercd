/**
 * Formats a duration in seconds to a readable string (e.g., "4s", "3m 2s", "1h 23m 48s")
 * @param totalSeconds The total duration in seconds
 * @returns A formatted time string
 */
export const formatDuration = (totalSeconds: number): string => {
    if (totalSeconds < 0) {
        return 'N/A';
    }

    if (totalSeconds === 0) {
        return 'N/A';
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const parts: string[] = [];

    if (hours > 0) {
        parts.push(`${hours}h`);
    }

    if (minutes > 0) {
        parts.push(`${minutes}m`);
    }

    if (seconds > 0 || parts.length === 0) {
        parts.push(`${seconds}s`);
    }

    return parts.join(' ');
};

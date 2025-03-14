import { LoaderCircle, LucideIcon, Package2 } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    actionLabel?: string;
    actionOnClick?: () => void;
    className?: string;
    loading?: boolean;
}

const EmptyState = ({
    icon: Icon = Package2,
    title = 'No data available',
    description = 'There are no items to display at the moment.',
    actionLabel,
    actionOnClick,
    className = '',
    loading = false,
}: EmptyStateProps) => {
    return (
        <div className={`flex flex-col h-84 items-center justify-center p-8 text-center ${className}`}>
            {loading ? (
                <div className="flex flex-col items-center gap-2">
                    <LoaderCircle className="size-8 animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            ) : (
                <>
                    <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                        <Icon className="size-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>
                    {actionLabel && actionOnClick && (
                        <Button onClick={actionOnClick} className="mt-6">
                            {actionLabel}
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default EmptyState;

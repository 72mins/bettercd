import { Badge } from '@/components/ui/badge';
import { SquareTerminal } from 'lucide-react';

const BaseNode = ({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="border border-gray-200 rounded-sm bg-white w-96 p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SquareTerminal className="text-muted-foreground" />
                    <p className="text-sm">{title}</p>
                </div>
                <Badge className="bg-sidebar text-neutral-500" variant="outline">
                    Custom
                </Badge>
            </div>
            <hr className="border-gray-100 border-t-1 mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
        </div>
    );
};

export default BaseNode;

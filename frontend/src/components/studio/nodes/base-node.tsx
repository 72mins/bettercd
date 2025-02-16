import { Badge } from '@/components/ui/badge';

const BaseNode = ({
    title,
    description,
    icon,
    children,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) => {
    return (
        <div className="border border-gray-200 rounded-md bg-white w-96 p-3 relative">
            <Badge variant="outline" className="text-xs bg-sidebar text-muted-foreground absolute left-0 top-[-28px]">
                Stage #1
            </Badge>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <p className="text-sm truncate max-w-60">{title}</p>
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

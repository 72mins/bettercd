import { Handle, Position } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const BaseNode = ({
    title,
    description,
    icon,
    order,
    stageType,
    last_order,
    children,
}: {
    title: string | unknown;
    description: string;
    icon: React.ReactNode;
    order: number;
    stageType: string;
    last_order: number;
    children: React.ReactNode;
}) => {
    return (
        <div className="border border-border rounded-md bg-background w-96 p-3 relative">
            <Badge variant="outline" className="text-xs bg-sidebar text-muted-foreground absolute left-0 top-[-28px]">
                Stage #{order}
            </Badge>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6">{icon}</div>
                    <p className="text-sm truncate max-w-60">{typeof title === 'string' ? title : ''}</p>
                </div>
                <Badge className="bg-sidebar text-neutral-500" variant="outline">
                    {stageType}
                </Badge>
            </div>
            <Separator className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
            <div className="mt-8 flex items-center justify-center">{children}</div>
            {order !== 0 && <Handle type="target" position={Position.Left} />}
            {order !== last_order && <Handle type="source" position={Position.Right} />}
        </div>
    );
};

export default BaseNode;

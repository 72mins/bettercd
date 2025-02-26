import { Handle, Position } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';

const BaseNode = ({
    title,
    description,
    icon,
    order,
    stageType,
    children,
}: {
    title: string | unknown;
    description: string;
    icon: React.ReactNode;
    order: number;
    stageType: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="border border-gray-200 rounded-md bg-white w-96 p-3 relative">
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
            <hr className="border-gray-100 border-t-1 mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
            <div className="mt-8 flex items-center justify-center">{children}</div>
            {order !== 1 && <Handle type="target" position={Position.Left} />}
            <Handle type="source" position={Position.Right} />
        </div>
    );
};

export default BaseNode;

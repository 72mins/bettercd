import { Handle, Position } from '@xyflow/react';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Ellipsis, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteStage } from '@/services/pipelines/stages';
import { toast } from 'sonner';

const BaseNode = ({
    id,
    title,
    description,
    icon,
    order,
    stageType,
    last_order,
    children,
}: {
    id: string;
    title: string | unknown;
    description: string;
    icon: React.ReactNode;
    order: number;
    stageType: string;
    last_order: number;
    children: React.ReactNode;
}) => {
    const { mutate } = useDeleteStage();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();

        mutate(+id, {
            onSuccess: () => {
                toast.success('Stage deleted successfully');
            },
        });
    };

    return (
        <div className="border border-border rounded-md bg-background w-96 p-3 relative">
            <div className="absolute left-0 top-[-28px] w-full flex justify-between items-center">
                <Badge variant="outline" className="text-xs bg-sidebar text-muted-foreground">
                    Stage #{order}
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="size-6 bg-sidebar border text-muted-foreground" variant="secondary">
                            <Ellipsis className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-42">
                        <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleDelete}>
                            <Trash2 className="size-4 text-red-500" />
                            Delete Stage
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
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

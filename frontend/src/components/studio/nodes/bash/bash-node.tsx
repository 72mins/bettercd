import { Handle, NodeProps, Position } from '@xyflow/react';

import BaseNode from '../base-node';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CodeEditor from './editor';

const BashNode = (props: NodeProps) => {
    const { id } = props;

    return (
        <>
            <BaseNode title="Custom Bash Script" description="Run a custom bash script">
                <Sheet>
                    <SheetTrigger>
                        <div className="flex items-center justify-center">
                            <Button className="text-blue-500" variant="link">
                                Edit Bash Script
                            </Button>
                        </div>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit Bash Script</SheetTitle>
                            <SheetDescription>Write your custom bash script here</SheetDescription>
                        </SheetHeader>
                        <div className="px-4">
                            <CodeEditor />
                        </div>
                    </SheetContent>
                </Sheet>
            </BaseNode>
            {+id !== 1 && <Handle type="target" position={Position.Left} />}
            <Handle type="source" position={Position.Right} />
        </>
    );
};

export default BashNode;

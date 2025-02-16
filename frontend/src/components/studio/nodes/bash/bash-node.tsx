import { useState } from 'react';

import { Handle, NodeProps, Position } from '@xyflow/react';
import { SquareTerminal } from 'lucide-react';

import BaseNode from '../base-node';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CodeEditor from './editor';

const BashNode = (props: NodeProps) => {
    const { id } = props;

    const [value, setValue] = useState<string>('#!/bin/bash\n\n# Write your bash script here...');

    return (
        <>
            <BaseNode
                title="Custom Bash Script"
                description="Checkout from VCS, run unit tests and send message to Slack"
                icon={<SquareTerminal className="text-muted-foreground" />}
            >
                <Sheet>
                    <SheetTrigger asChild className="w-full">
                        <div className="flex items-center justify-center">
                            <Button className="text-blue-500" variant="link">
                                Edit Bash Script
                            </Button>
                        </div>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit Bash Script</SheetTitle>
                            <SheetDescription>Edit the custom bash script running for this stage</SheetDescription>
                        </SheetHeader>
                        <div className="px-4">
                            <CodeEditor value={value} setValue={setValue} />
                            <div className="flex justify-end">
                                <Button className="mt-4 min-w-36" variant="default">
                                    Save Changes
                                </Button>
                            </div>
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

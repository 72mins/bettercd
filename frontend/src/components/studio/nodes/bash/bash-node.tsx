import { useEffect, useState } from 'react';

import { NodeProps } from '@xyflow/react';
import { FilePenLine, SquareTerminal } from 'lucide-react';
import { toast } from 'sonner';

import BaseNode from '../base-node';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CodeEditor from './editor';
import { useGetScriptValue, useUpdateStage } from '@/services/pipelines/stages';

interface BashNodeProps extends NodeProps {
    data: {
        label: string;
        order: number;
        script: string | null;
    };
}

const INITIAL_VALUE = `#!/bin/bash\n\n# Write your bash script here...\n\n`;

const BashNode = (props: BashNodeProps) => {
    const {
        id,
        data: { label, order, script },
    } = props;

    const { data, isPending: scriptPending } = useGetScriptValue(+id, script);
    const { mutate, isPending } = useUpdateStage();

    const [value, setValue] = useState<string>(INITIAL_VALUE);

    const saveChanges = () => {
        mutate({ id, script_value: value }, { onSuccess: () => toast.success('Script updated successfully') });
    };

    useEffect(() => {
        if (data) setValue(data?.script_value || INITIAL_VALUE);
    }, [data]);

    return (
        <>
            <BaseNode
                title={label}
                description="Checkout from VCS, run unit tests and send message to Slack"
                order={order}
                icon={<SquareTerminal className="text-muted-foreground" />}
                stageType="Custom"
            >
                <Sheet>
                    <SheetTrigger asChild>
                        <Button disabled={scriptPending} variant="link">
                            <FilePenLine />
                            Edit Bash Script
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit Bash Script</SheetTitle>
                            <SheetDescription>Edit the custom bash script running for this stage</SheetDescription>
                        </SheetHeader>
                        <div className="px-4">
                            <CodeEditor value={value} setValue={setValue} />
                            <div className="flex justify-end">
                                <Button
                                    onClick={saveChanges}
                                    loading={isPending}
                                    className="mt-4 min-w-36"
                                    variant="default"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </BaseNode>
        </>
    );
};

export default BashNode;

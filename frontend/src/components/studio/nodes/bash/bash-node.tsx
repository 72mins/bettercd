import { NodeProps } from '@xyflow/react';
import { FilePenLine, SquareTerminal } from 'lucide-react';

import BaseNode from '../base-node';
import { Button } from '@/components/ui/button';
import { useGetScriptValue } from '@/services/pipelines/stages';
import { usePanelStore } from '@/store/panel';

interface BashNodeProps extends NodeProps {
    data: {
        label: string;
        order: number;
        script: string | null;
    };
}

const BashNode = (props: BashNodeProps) => {
    const {
        id,
        data: { label, order },
    } = props;

    const openPanel = usePanelStore((state) => state.openPanel);

    const { isPending: scriptPending } = useGetScriptValue(+id);

    return (
        <>
            <BaseNode
                title={label}
                description="Checkout from VCS, run unit tests and send message to Slack"
                order={order}
                icon={<SquareTerminal className="text-muted-foreground" />}
                stageType="Custom"
            >
                <Button disabled={scriptPending} variant="link" onClick={() => openPanel(id)}>
                    <FilePenLine />
                    Edit Bash Script
                </Button>
            </BaseNode>
        </>
    );
};

export default BashNode;

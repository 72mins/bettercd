import { NodeProps, useReactFlow } from '@xyflow/react';
import { FilePenLine, SquareTerminal } from 'lucide-react';

import BaseNode from '../base-node';
import { Button } from '@/components/ui/button';
import { useGetScriptValue } from '@/services/pipelines/stages';
import { usePanelStore } from '@/store/panel';

interface BashNodeProps extends NodeProps {
    data: {
        label: string;
        description: string;
        order: number;
        last_order: number;
    };
}

const BashNode = (props: BashNodeProps) => {
    const {
        id,
        data: { label, description, order, last_order },
    } = props;

    const { fitView } = useReactFlow();

    const openPanel = usePanelStore((state) => state.openPanel);

    const { isPending: scriptPending } = useGetScriptValue(+id);

    const handlePanelOpen = () => {
        openPanel(id);

        setTimeout(() => {
            fitView({ nodes: [{ id }], duration: 500, maxZoom: 1.1 });
        }, 150);
    };

    return (
        <>
            <BaseNode
                id={id}
                title={label}
                description={description}
                order={order}
                last_order={last_order}
                icon={<SquareTerminal className="text-muted-foreground" />}
                stageType="Custom"
            >
                <Button disabled={scriptPending} variant="link" onClick={handlePanelOpen}>
                    <FilePenLine />
                    Edit Bash Script
                </Button>
            </BaseNode>
        </>
    );
};

export default BashNode;

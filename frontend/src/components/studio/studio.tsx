import { useMemo } from 'react';

import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';

import BashNode from './nodes/bash/bash-node';
import { Stage } from '@/services/pipelines/stages';
import { calculateEdges, calculatePosition, getNodeType } from './utils';

import '@xyflow/react/dist/style.css';

const NODE_TYPES = {
    bash: BashNode,
};

const Studio = ({ data }: { data: Stage[] }) => {
    const edges = useMemo(() => calculateEdges(data), [data]);

    const nodes = useMemo(() => {
        return data.map((stage) => ({
            id: stage.id.toString(),
            position: calculatePosition(stage.order),
            type: getNodeType(stage.stage_type),
            data: { label: stage.name, order: stage.order, script: stage.script },
        }));
    }, [data]);

    return (
        <div className="w-full h-full">
            <ReactFlow nodeTypes={NODE_TYPES} nodes={nodes} edges={edges}>
                <Background variant={BackgroundVariant.Dots} size={2} />
            </ReactFlow>
        </div>
    );
};

export default Studio;

import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';

import BashNode from './nodes/bash/bash-node';

import '@xyflow/react/dist/style.css';

const NODE_TYPES = {
    bash: BashNode,
};

const initialNodes = [
    { id: '1', position: { x: 100, y: 350 }, data: { label: '1' }, type: 'bash' },
    { id: '2', position: { x: 600, y: 350 }, data: { label: '2' }, type: 'bash' },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const Studio = () => {
    return (
        <div className="w-full h-full">
            <ReactFlow nodeTypes={NODE_TYPES} nodes={initialNodes} edges={initialEdges}>
                <Background variant={BackgroundVariant.Dots} size={2} />
            </ReactFlow>
        </div>
    );
};

export default Studio;

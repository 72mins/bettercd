import { useMemo } from 'react';

import { ReactFlow, Background, BackgroundVariant, Controls } from '@xyflow/react';

import BashNode from './nodes/bash/bash-node';
import GithubNode from './nodes/github/github-node';
import { Stage } from '@/services/pipelines/stages';
import EditorPanel from './nodes/bash/editor-panel';
import StudioActions from './actions/studio-actions';
import { usePanelStore } from '@/store/panel';
import { calculateEdges, calculatePosition, getNodeType } from './utils';

import '@xyflow/react/dist/style.css';

const NODE_TYPES = {
    bash: BashNode,
    github: GithubNode,
};

const Studio = ({ data }: { data: Stage[] }) => {
    const panelOpen = usePanelStore((state) => state.panelOpen);

    const edges = useMemo(() => calculateEdges(data), [data]);

    const nodes = useMemo(() => {
        return data.map((stage) => ({
            id: stage.id.toString(),
            position: calculatePosition(stage.order),
            type: getNodeType(stage.stage_type),
            data: { label: stage.name, order: stage.order, script: stage.script },
        }));
    }, [data]);

    // TODO: Remove when Github node is implemented

    //nodes.push({
    //    id: 'github',
    //    position: { x: -300, y: 350 },
    //    type: 'github',
    //    data: { label: 'Github Checkout', order: 0, script: null },
    //});

    return (
        <div className="w-full h-[calc(100vh-113px)] flex">
            <StudioActions />
            <ReactFlow
                fitView
                fitViewOptions={{ maxZoom: 1 }}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                panOnDrag={!panelOpen}
                nodesConnectable={false}
                nodeTypes={NODE_TYPES}
                nodes={nodes}
                edges={edges}
            >
                <Background patternClassName="studio-pattern" variant={BackgroundVariant.Dots} size={2} />
                <Controls
                    position="top-left"
                    fitViewOptions={{ maxZoom: 1 }}
                    showZoom={false}
                    showInteractive={false}
                    showFitView={!panelOpen}
                />
            </ReactFlow>
            <EditorPanel />
        </div>
    );
};

export default Studio;

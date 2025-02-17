import { Stage } from '@/services/pipelines/stages';

export const getNodeType = (stageType: string) => {
    switch (stageType) {
        case 'CUSTOM':
            return 'bash';
        default:
            return 'bash';
    }
};

export const calculatePosition = (order: number) => {
    // Offset the first node to the right, so it's not at the edge
    if (order === 1) {
        return { x: 200, y: 350 };
    }

    return { x: 200 + (order - 1) * 500, y: 350 };
};

export const calculateEdges = (stages: Stage[]) => {
    return stages
        .map((stage, index) => {
            if (index === stages.length - 1) {
                return null;
            }

            return {
                id: `e${stage.id}-${stages[index + 1].id}`,
                source: stage.id.toString(),
                target: stages[index + 1].id.toString(),
            };
        })
        .filter((edge) => edge !== null);
};

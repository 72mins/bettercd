import { axiosInstance } from '@/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type NodeTypes = 'GITHUB' | 'CUSTOM' | 'DEPLOY' | 'TEST' | 'NOTIFY';

export interface Stage {
    id: number;
    name: string;
    description?: string;
    order: number;
    node_type: NodeTypes;
    script: string | null;
    pipeline: number;
}

interface CreateStageParams {
    name: string;
    description: string;
    node_type: string;
    pipeline: number;
}

const fetchPipelineStages = async (id: number): Promise<Stage[]> => {
    const res = await axiosInstance.get(`/ci-cd/stage/${id}/pipeline_stages/`);

    return res.data;
};

export const useFetchPipelineStages = (id: number) => {
    return useQuery<Stage[], Error>({
        queryKey: ['pipeline-stages', id],
        queryFn: () => fetchPipelineStages(id),
    });
};

const createStage = async (data: CreateStageParams): Promise<Stage> => {
    const res = await axiosInstance.post('/ci-cd/stage/', data);

    return res.data;
};

export const useCreateStage = () => {
    const queryClient = useQueryClient();

    return useMutation<Stage, Error, CreateStageParams>({
        mutationFn: (data) => createStage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
        },
    });
};

export const useCreateGithubNode = () => {
    const data = {
        name: 'GitHub',
        description: 'Checkout latest changes from Github repository',
        node_type: 'GITHUB',
    };

    const queryClient = useQueryClient();

    return useMutation<Stage, Error, { pipeline: number }>({
        mutationFn: (pipeline) => createStage({ ...data, ...pipeline }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
        },
    });
};

const updateStage = async (data: { id: string; script_value: string }) => {
    const res = await axiosInstance.patch(`/ci-cd/stage/${data.id}/`, { script_value: data.script_value });

    return res.data;
};

export const useUpdateStage = () => {
    const queryClient = useQueryClient();

    return useMutation<Stage, Error, { id: string; script_value: string }>({
        mutationFn: (data) => updateStage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
        },
    });
};

const getScriptValue = async (id: number): Promise<{ script_value: string }> => {
    const res = await axiosInstance.get(`/ci-cd/stage/${id}/script_value/`);

    return res.data;
};

export const useGetScriptValue = (id: number) => {
    return useQuery<{ script_value: string }, Error>({
        queryKey: ['script-value', id],
        queryFn: () => getScriptValue(id),
        enabled: id > 0,
    });
};

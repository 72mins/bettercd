import { axiosInstance } from '@/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Stage {
    id: number;
    name: string;
    description?: string;
    order: number;
    stage_type: 'CUSTOM' | 'DEPLOY';
    script: string | null;
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

const createStage = async (data: {
    name: string;
    description: string;
    node_type: string;
    pipeline: number;
}): Promise<Stage> => {
    const res = await axiosInstance.post('/ci-cd/stage/', data);

    return res.data;
};

export const useCreateStage = () => {
    const queryClient = useQueryClient();

    return useMutation<Stage, Error, { name: string; description: string; node_type: string; pipeline: number }>({
        mutationFn: (data) => createStage(data),
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

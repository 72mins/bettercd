import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '@/axios';
import { Pagination } from '@/consts/types/auth';

interface Pipeline {
    id: number;
    name: string;
    description: string;
}

interface PipelineResponse extends Pagination {
    results: Pipeline[];
}

const fetchPipelines = async (page?: number): Promise<PipelineResponse> => {
    const res = await axiosInstance.get(`/ci-cd/pipeline/?page=${page}`);

    return res.data;
};

export const useFetchPipelines = (page: number = 1) => {
    return useQuery<PipelineResponse, Error>({
        queryKey: ['pipelines', page],
        queryFn: () => fetchPipelines(page),
        placeholderData: keepPreviousData,
    });
};

const createPipeline = async (data: { name: string; description: string }): Promise<Pipeline> => {
    const res = await axiosInstance.post('/ci-cd/pipeline/', data);

    return res.data;
};

export const useCreatePipeline = () => {
    const queryClient = useQueryClient();

    return useMutation<Pipeline, Error, { name: string; description: string }>({
        mutationFn: (data) => createPipeline(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pipelines'] });
        },
    });
};

const deletePipeline = async (id: number) => {
    await axiosInstance.delete(`/ci-cd/pipeline/${id}/`);

    return id;
};

export const useDeletePipeline = () => {
    const queryClient = useQueryClient();

    return useMutation<number, Error, number>({
        mutationFn: (id) => deletePipeline(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pipelines'] });
        },
    });
};

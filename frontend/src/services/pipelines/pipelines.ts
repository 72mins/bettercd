import { axiosInstance } from '@/axios';
import { Pagination } from '@/consts/types/auth';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

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

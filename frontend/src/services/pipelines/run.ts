import { axiosInstance } from '@/axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface PipelineRes {
    message: string;
}

const runPipeline = async (pipelineId: number): Promise<PipelineRes> => {
    const res = await axiosInstance.post('/docker/run-pipeline/', { pipeline_id: pipelineId });

    return res.data;
};

export const useRunPipeline = () => {
    return useMutation<PipelineRes, Error, number>({
        mutationFn: (pipelineId) => runPipeline(pipelineId),
        onSuccess: () => {
            toast.success('Started running pipeline');
        },
    });
};

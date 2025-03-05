import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/axios';

interface MassStageUpdateParams {
    pipelineID: number;
    params: string;
}

const massStageUpdate = async (data: MassStageUpdateParams) => {
    const res = await axiosInstance.patch(`/ci-cd/pipeline/mass-save/${data.pipelineID}/`, data);

    return res.data;
};

export const useMassStageUpdate = () => {
    return useMutation({
        mutationFn: (data: MassStageUpdateParams) => massStageUpdate(data),
    });
};

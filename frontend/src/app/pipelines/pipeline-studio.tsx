import { useParams } from 'react-router';

import { LoaderCircle } from 'lucide-react';

import Studio from '@/components/studio/studio';
import { useFetchPipelineStages } from '@/services/pipelines/stages';
import EmptyState from '@/components/base/empty-state';

const PipelineStudio = () => {
    const { pipelineID = 0 } = useParams();

    const { data, isPending } = useFetchPipelineStages(+pipelineID);

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-113px)]">
                <LoaderCircle className="size-10 animate-spin" />
            </div>
        );
    }

    if (!data) {
        return <EmptyState />;
    }

    return <Studio last_order={data?.last_order} data={data?.stages} />;
};

export default PipelineStudio;

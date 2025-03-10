import { useParams } from 'react-router';

import Studio from '@/components/studio/studio';
import { useFetchPipelineStages } from '@/services/pipelines/stages';

const PipelineStudio = () => {
    const { pipelineID = 0 } = useParams();

    const { data, isPending } = useFetchPipelineStages(+pipelineID);

    // TODO: Refactor the pending and no data found logic to something better

    if (isPending) {
        return <div>Loading...</div>;
    }

    // NOTE: This is temporary to satisfy TypeScript
    if (!data) {
        return <div>No data found</div>;
    }

    return <Studio last_order={data?.last_order} data={data?.stages} />;
};

export default PipelineStudio;

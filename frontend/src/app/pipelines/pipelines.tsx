import Header from '@/components/base/header';
import PipelineTable from './pipeline-table';

const PipelinePage = () => {
    return (
        <>
            <Header title="Pipelines" subTitle="Create and maintain CI/CD pipelines" />
            <PipelineTable />
        </>
    );
};

export default PipelinePage;

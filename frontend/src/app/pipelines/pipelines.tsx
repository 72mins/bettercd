import Header from '@/components/base/header';
import PipelineTable from './pipeline-table';

const PipelinePage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header title="Pipelines" />
            <PipelineTable />
        </div>
    );
};

export default PipelinePage;

import Header from '@/components/base/header';
import GithubIntegration from '@/components/integrations/github';

const IntegrationsPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <Header title="Integrations" />
            <GithubIntegration />
        </div>
    );
};

export default IntegrationsPage;

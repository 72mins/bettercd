import { Routes, Route, Navigate } from 'react-router';

import LoginPage from './app/auth/login';
import LoginRoute from './app/auth/login-route';
import PrivateRoute from './app/auth/private-route';
import { Toaster } from './components/ui/sonner';
import DashboardPage from './app/dashboard/dashboard';
import PipelinePage from './app/pipelines/pipelines';
import PipelineStudio from './app/pipelines/pipeline-studio';
import IntegrationsPage from './app/integrations';

function App() {
    return (
        <>
            <Toaster toastOptions={{ duration: 5000 }} />
            <Routes>
                <Route element={<LoginRoute />}>
                    <Route path="/" element={<LoginPage />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />}>
                        <Route index element={<Navigate to="/dashboard/ci-cd/pipelines" replace />} />
                        <Route path="ci-cd">
                            <Route index element={<Navigate to="/dashboard/ci-cd/pipelines" replace />} />
                            <Route path="pipelines" element={<PipelinePage />} />
                            <Route path="pipelines/:pipelineID/studio" element={<PipelineStudio />} />
                            <Route path="build-history" element={<div>Build History</div>} />
                        </Route>
                        <Route path="integrations">
                            <Route index element={<IntegrationsPage />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;

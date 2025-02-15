import { Routes, Route, Navigate } from 'react-router';

import LoginPage from './app/auth/login';
import LoginRoute from './app/auth/login-route';
import PrivateRoute from './app/auth/private-route';
import { Toaster } from './components/ui/sonner';
import DashboardPage from './app/dashboard/dashboard';

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
                            <Route path="pipelines" element={<div>Pipelines</div>} />
                            <Route path="build-history" element={<div>Build History</div>} />
                        </Route>
                        <Route path="git" element={<div>Git Integration</div>} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;

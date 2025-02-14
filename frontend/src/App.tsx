import { Routes, Route } from 'react-router';

import LoginPage from './app/auth/login';
import LoginRoute from './app/auth/login-route';
import PrivateRoute from './app/auth/private-route';
import DashboardPage from './app/dashboard/dashboard';
import { Toaster } from './components/ui/sonner';

function App() {
    return (
        <>
            <Toaster toastOptions={{ duration: 5000 }} />
            <Routes>
                <Route element={<LoginRoute />}>
                    <Route path="/" element={<LoginPage />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;

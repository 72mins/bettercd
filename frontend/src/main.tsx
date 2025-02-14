import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';
import axios from 'axios';

import App from './App.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: (err) => {
                if (axios.isAxiosError(err) && err.status === 400) {
                    if (err.response?.data?.error) {
                        toast.error(err.response.data.error);
                    }
                }
            },
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
    </QueryClientProvider>
);

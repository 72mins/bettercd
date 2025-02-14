import axios from 'axios';

import { fetchTokens, removeTokens, setLsAccess } from '@/lib/localStorage';
import { setHeaderToken } from '.';

const BASE_URL = import.meta.env.VITE_BE_URL;

const axiosInst = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const fetchNewToken = async () => {
    const tokens = fetchTokens();

    try {
        const token: string = await axiosInst
            .post('/api/token/refresh/', { refresh: tokens?.refresh })
            .then((res) => res.data.access);

        return token;
    } catch {
        return null;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const refreshAuth = async (failedRequest: any) => {
    const newToken = await fetchNewToken();

    if (newToken) {
        failedRequest.response.config.headers.Authorization = `Bearer ${newToken}`;

        setHeaderToken(newToken);
        setLsAccess(newToken);

        return Promise.resolve(newToken);
    } else {
        removeTokens();
        window.location.href = '/';

        return Promise.reject();
    }
};

import { AuthTokens } from '@/consts/types/auth';

export const fetchTokens = () => {
    const tokens = localStorage.getItem('cicd_tokens')
        ? JSON.parse(localStorage.getItem('cicd_tokens') as string)
        : null;

    return tokens;
};

export const removeTokens = () => localStorage.removeItem('cicd_tokens');

export const setTokens = (data: AuthTokens) => localStorage.setItem('cicd_tokens', JSON.stringify(data));

export const setLsAccess = (token: string) => {
    const tokens = fetchTokens();

    if (tokens) {
        setTokens({ ...tokens, access: token });
    }
};

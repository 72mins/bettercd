import { AuthTokens } from '@/consts/types/auth';

export const fetchTokens = () => {
    const tokens = localStorage.getItem('bettercd_tokens')
        ? JSON.parse(localStorage.getItem('bettercd_tokens') as string)
        : null;

    return tokens;
};

export const removeTokens = () => localStorage.removeItem('bettercd_tokens');

export const setTokens = (data: AuthTokens) => localStorage.setItem('bettercd_tokens', JSON.stringify(data));

export const setLsAccess = (token: string) => {
    const tokens = fetchTokens();

    if (tokens) {
        setTokens({ ...tokens, access: token });
    }
};

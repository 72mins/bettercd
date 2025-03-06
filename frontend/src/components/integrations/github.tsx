import { useEffect, useCallback } from 'react';

import { axiosInstance } from '@/axios';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardTitle } from '../ui/card';
import { useTheme } from '../theme/theme-provider';
import GithubDark from '@/img/github-dark.svg';
import GithubLight from '@/img/github-light.svg';
import { Button } from '../ui/button';
import { useGithubStore } from '@/store/github';

const GithubIntegration = () => {
    const { profile, setProfile, clearProfile } = useGithubStore();

    const { theme } = useTheme();

    const initiateGithubConnect = async () => {
        try {
            const response = await axiosInstance.get('/github/auth-url/');

            window.location.href = response.data.auth_url;
        } catch {
            toast.error('Failed to connect GitHub App');
        }
    };

    const removeIntegration = async () => {
        try {
            const response = await axiosInstance.delete('/github/remove-integration/');

            if (response.data.github_app_removal_url) {
                clearProfile();

                const width = 1200;
                const height = 600;
                const left = window.screen.width / 2 - width / 2;
                const top = window.screen.height / 2 - height / 2;

                window.open(
                    response.data.github_app_removal_url,
                    'github-removal',
                    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
                );
            }
        } catch {
            toast.error('Failed to remove GitHub App');
        }
    };

    const handleGithubCallback = useCallback(
        async (installationId: string) => {
            try {
                const response = await axiosInstance.post('/github/callback/', {
                    installation_id: installationId,
                });

                setProfile(response.data);

                window.history.replaceState({}, document.title, window.location.pathname);
            } catch {
                toast.error('Failed to connect GitHub App');
            }
        },
        [setProfile]
    );

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        const installationId = urlParams.get('installation_id');

        if (installationId) handleGithubCallback(installationId);
    }, [handleGithubCallback]);

    return (
        <Card className="w-1/3">
            <CardContent className="flex flex-col gap-2">
                <img src={theme === 'light' ? GithubDark : GithubLight} alt="GitHub" className="size-10" />
                <CardTitle className="mt-4">GitHub</CardTitle>
                <CardDescription>
                    Integrate with GitHub to use GitHub repositories, events and webhooks in your pipelines.
                </CardDescription>
                {profile?.github_user_id ? (
                    <Button variant="destructive" className="mt-4" onClick={removeIntegration}>
                        Disconnect
                    </Button>
                ) : (
                    <Button className="mt-4" onClick={initiateGithubConnect}>
                        Install
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default GithubIntegration;

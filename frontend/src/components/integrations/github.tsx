// Ignore typescript for this file
// @ts-nocheck

import { axiosInstance } from '@/axios';
import { useEffect, useState } from 'react';

const GithubConnect = () => {
    const [githubProfile, setGithubProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initiateGithubConnect = async () => {
        try {
            const response = await axiosInstance.get('/github/auth-url/');
            window.location.href = response.data.auth_url;
        } catch (err) {
            setError('Failed to initiate GitHub connection');
            console.error(err);
        }
    };

    const handleGithubCallback = async (code) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/github/callback/', { code });
            setGithubProfile(response.data);
            // Clear the code from the URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Fetch repositories after successful connection
        } catch (err) {
            setError('Failed to connect GitHub account');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check if we're handling the OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            handleGithubCallback(code);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="mt-8">
            {!githubProfile ? (
                <button
                    onClick={initiateGithubConnect}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                    Connect GitHub Account
                </button>
            ) : (
                <div>
                    <h2 className="text-xl font-bold mb-4">Connected as {githubProfile.github_username}</h2>
                </div>
            )}
        </div>
    );
};

export default GithubConnect;

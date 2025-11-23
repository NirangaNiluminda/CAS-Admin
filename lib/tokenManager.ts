// Token Manager - Utilities for managing access and refresh tokens
// Stores tokens in localStorage and provides utilities for token operations

/**
 * Get the access token from localStorage
 */
export const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

/**
 * Get the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
};

/**
 * Store both access and refresh tokens
 */
export const setTokens = (accessToken: string, refreshToken?: string): void => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('token', accessToken);
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
};

/**
 * Clear both access and refresh tokens
 */
export const clearTokens = (): void => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminData');
};

/**
 * Check if a token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return false;

        // Check if token expires in less than 1 minute (buffer time)
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const bufferTime = 60 * 1000; // 1 minute buffer

        return currentTime >= (expirationTime - bufferTime);
    } catch (error) {
        return true; // If we can't parse it, assume it's expired
    }
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        return null;
    }

    try {
        // Determine API URL
        let apiUrl = 'http://localhost:4000';
        if (typeof window !== 'undefined') {
            if (window.location.hostname !== 'localhost') {
                apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://softbackendnewrender.onrender.com';
            }
        }

        const response = await fetch(`${apiUrl}/api/v1/refresh`, {
            method: 'GET',
            headers: {
                'Cookie': `refresh_token=${refreshToken}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();

        if (data.success && data.accessToken) {
            // Store new tokens
            setTokens(data.accessToken, data.refreshToken);
            return data.accessToken;
        }

        return null;
    } catch (error) {
        console.error('Error refreshing token:', error);
        clearTokens();
        return null;
    }
};

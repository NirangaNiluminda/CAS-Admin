// Configured Axios Instance with automatic token refresh
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, refreshAccessToken, clearTokens } from './tokenManager';

// Determine base URL
const getBaseURL = (): string => {
    if (typeof window === 'undefined') {
        return 'http://localhost:4000';
    }

    return window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://softbackendnewrender.onrender.com';
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Queue of failed requests waiting for token refresh
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });

    failedQueue = [];
};

// Request interceptor to attach the access token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors and refresh token
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshAccessToken();

                if (newAccessToken) {
                    // Update the authorization header with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    processQueue(null);
                    return axiosInstance(originalRequest);
                } else {
                    // Refresh failed, clear tokens and redirect to login
                    processQueue(error);
                    clearTokens();

                    if (typeof window !== 'undefined') {
                        window.location.href = '/';
                    }

                    return Promise.reject(error);
                }
            } catch (refreshError) {
                processQueue(error);
                clearTokens();

                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

/**
 * @module interceptors
 * @description Axios interceptors configuration for API requests/responses
 */

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS, API_ERROR_CODES, PATHS } from "@/utils";
import { createApiError, handleApiError } from "@/api";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
    failedQueue = [];
};

const redirectToSignin = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_redirect_triggered', 'true');

        const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
        if (!window.location.pathname.includes(PATHS.SIGNIN)) {
            window.location.href = `${PATHS.SIGNIN}?redirect=${currentPath}`;
        }
    }
};

const redirectToForbidden = () => {
    if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/forbidden')) {
            window.location.href = '/forbidden';
        }
    }
};

// if URL contains admin-related paths, redirect to forbidden
const isAdminRequest = (url) => {
    const adminPaths = ['/admin'];
    return adminPaths.some(path => url.includes(path));
};



/**
 * Configures request and response interceptors for an Axios instance
 * @function setupInterceptors
 * @param {AxiosInstance} [apiClient=axios.create()] - Axios instance to configure
 * @returns {void} 
 * @description
 * Request Interceptor:
 * - Logs outgoing requests
 * - Enables credentials for all requests
 * 
 * Response Interceptor:
 * - Success: Passes through successful responses
 * - Error: Converts Axios errors to standardized ApiError format
 */
export const setupInterceptors = (apiClient = axios.create()) => {
    apiClient.interceptors.request.use(
        (config) => {
            config.withCredentials = true;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_redirect_triggered');
            }
            return config;
        },
        (error) => Promise.reject(createApiError(error))
    )

    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const apiError = createApiError(error);
            const originalRequest = error.config;

            if (apiError.status === 401) {
                if (originalRequest.url?.includes('/delete-my-account')) { 
                    return Promise.reject(apiError);
                }
                if (apiError.errorCode === API_ERROR_CODES.TOKEN_EXPIRED && !originalRequest._retry) {
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then(() => apiClient(originalRequest))
                            .catch((err) => Promise.reject(createApiError(err)))
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;
                    try {
                        // Attempt to refresh the token
                        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {}, { withCredentials: true });

                        // If successful, retry original request
                        processQueue(null);
                        return apiClient(originalRequest);
                    } catch (refreshTokenError) {
                        const refreshTokenApiError = createApiError(refreshTokenError);
                        processQueue(refreshTokenApiError);

                        // Dispatch auth event
                        window.dispatchEvent(
                            new CustomEvent('auth-event', {
                                detail: {
                                    type: 'auth-invalid',
                                    message: refreshTokenApiError.message || 'Your session has expired. Please sign in again.',
                                    status: refreshTokenApiError.status
                                }
                            })
                        )

                        if (typeof window !== 'undefined' && !localStorage.getItem('auth_redirect_triggered')) {
                            localStorage.removeItem('user');
                            redirectToSignin();
                        }

                        return Promise.reject(refreshTokenApiError);
                    }
                    finally {
                        isRefreshing = false;
                    }
                }
                else if ([API_ERROR_CODES.TOKEN_INVALID, API_ERROR_CODES.TOKEN_MISSING, API_ERROR_CODES.TOKEN_TAMPERED].includes(apiError.errorCode)) {
                    handleApiError(apiError);

                    // Dispatch auth event
                    window.dispatchEvent(
                        new CustomEvent('auth-event', {
                            detail: {
                                type: 'auth-invalid',
                                message: apiError.message || 'Invalid or missing token. Please sign in again.',
                                status: apiError.status,
                            }
                        })
                    )

                    if (typeof window !== 'undefined' && !localStorage.getItem('auth_redirect_triggered')) {
                        localStorage.removeItem('user');
                        redirectToSignin();
                    }
                    return Promise.reject(apiError);
                }
                else {
                    handleApiError(apiError);
                    window.dispatchEvent(
                        new CustomEvent('auth-event', {
                            detail: {
                                type: 'auth-invalid',
                                message: apiError.message || 'Authentication failed. Please sign in again.',
                                status: apiError.status
                            }
                        })
                    )
                    return Promise.reject(apiError);
                }
            }

            if (apiError.status === 403) {
                handleApiError(apiError);

                const shouldRedirect = isAdminRequest(originalRequest.url || '');
                if (shouldRedirect) {
                    // Admin request - redirect to forbidden page
                    window.dispatchEvent(
                        new CustomEvent('permission-error', {
                            detail: {
                                message: apiError.message || 'Admin access required. You do not have permission to access this resource.',
                                status: apiError.status
                            }
                        })
                    );
                    redirectToForbidden();
                }
                return Promise.reject(apiError);
            }

            return Promise.reject(apiError);
        }
    )
}
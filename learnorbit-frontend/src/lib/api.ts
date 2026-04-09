/**
 * Axios API Client Configuration
 * 
 * Centralized API client with interceptors for authentication,
 * error handling, and request/response transformation.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, clearTokens } from './auth';

// Create axios instance with base configuration
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to all requests
 */
api.interceptors.request.use(
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

/**
 * Response Interceptor
 * Handles common error scenarios like 401 (unauthorized)
 */
api.interceptors.response.use(
    (response) => {
        // Return the response data directly for cleaner API calls
        return response;
    },
    (error: AxiosError) => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            clearTokens();

            // Redirect to login only on client side
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        // Handle 403 Forbidden - insufficient permissions
        // This usually means a stale token with the wrong role is being used.
        // Clear storage and force re-login so the user gets the right token.
        if (error.response?.status === 403) {
            console.warn('Access forbidden (wrong role or stale token):', error.config?.url);
            clearTokens();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        // Handle 500 Internal Server Error
        if (error.response?.status === 500) {
            console.error('Server error:', error.response.data);
        }

        return Promise.reject(error);
    }
);

/**
 * API Helper Functions
 */

// Generic GET request
export const get = <T>(url: string, config = {}) =>
    api.get<T>(url, config).then(res => res.data);

// Generic POST request
export const post = <T>(url: string, data?: any, config = {}) =>
    api.post<T>(url, data, config).then(res => res.data);

// Generic PUT request
export const put = <T>(url: string, data?: any, config = {}) =>
    api.put<T>(url, data, config).then(res => res.data);

// Generic PATCH request
export const patch = <T>(url: string, data?: any, config = {}) =>
    api.patch<T>(url, data, config).then(res => res.data);

// Generic DELETE request
export const del = <T>(url: string, config = {}) =>
    api.delete<T>(url, config).then(res => res.data);

export default api;

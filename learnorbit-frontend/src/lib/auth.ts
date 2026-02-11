/**
 * Authentication Utilities
 * 
 * Helper functions for managing JWT tokens and user authentication state
 * in the browser's localStorage.
 */

const ACCESS_TOKEN_KEY = 'learnorbit_access_token';
const REFRESH_TOKEN_KEY = 'learnorbit_refresh_token';
const USER_KEY = 'learnorbit_user';

/**
 * Token Management
 */

// Get access token from localStorage
export const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Set access token in localStorage
export const setAccessToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Set refresh token in localStorage
export const setRefreshToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

// Set both tokens at once (typically after login)
export const setTokens = (accessToken: string, refreshToken?: string): void => {
    setAccessToken(accessToken);
    if (refreshToken) {
        setRefreshToken(refreshToken);
    }
};

// Clear all tokens (typically on logout)
export const clearTokens = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

/**
 * User Data Management
 */

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
        return JSON.parse(userStr) as User;
    } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
    }
};

// Set current user in localStorage
export const setCurrentUser = (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear current user from localStorage
export const clearCurrentUser = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
};

/**
 * Authentication State Checks
 */

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
};

// Check if user has a specific role
export const hasRole = (role: User['role']): boolean => {
    const user = getCurrentUser();
    return user?.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles: User['role'][]): boolean => {
    const user = getCurrentUser();
    return user ? roles.includes(user.role) : false;
};

/**
 * JWT Token Utilities
 */

// Decode JWT token (without verification - for client-side use only)
export const decodeToken = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

// Get token expiration time
export const getTokenExpiration = (token: string): Date | null => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
};

/**
 * Logout Function
 */
export const logout = (): void => {
    clearTokens();
    clearCurrentUser();

    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

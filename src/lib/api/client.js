import axios from 'axios';
import Cookies from 'js-cookie';

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors & token refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = Cookies.get('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });

                    const { access_token } = response.data.data;
                    Cookies.set('token', access_token, { expires: 1 });

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                Cookies.remove('token');
                Cookies.remove('refresh_token');

                // Only redirect on client side
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
            }
        }

        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan';

        return Promise.reject({
            status: error.response?.status,
            message: errorMessage,
            errors: error.response?.data?.errors || {},
            originalError: error,
        });
    }
);

// Helper methods
export const setAuthToken = (token, refreshToken = null) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
    if (refreshToken) {
        Cookies.set('refresh_token', refreshToken, { expires: 7 }); // 7 days
    }
};

export const removeAuthToken = () => {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
};

export const getAuthToken = () => {
    return Cookies.get('token');
};

export const isAuthenticated = () => {
    return !!Cookies.get('token');
};

export default apiClient;

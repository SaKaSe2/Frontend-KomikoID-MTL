import apiClient, { setAuthToken, removeAuthToken } from '../client';
import { ENDPOINTS } from '../endpoints';

export const authService = {
    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{user: object, token: string}>}
     */
    async login(email, password) {
        const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
        });

        const { user, access_token } = response.data.data;
        setAuthToken(access_token);

        return { user, token: access_token };
    },

    /**
     * Register new user
     * @param {object} data - { name, email, password, password_confirmation }
     * @returns {Promise<{user: object, token: string}>}
     */
    async register(data) {
        const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);

        const { user, access_token } = response.data.data;
        setAuthToken(access_token);

        return { user, token: access_token };
    },

    /**
     * Logout user
     */
    async logout() {
        try {
            await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
        } finally {
            removeAuthToken();
        }
    },

    /**
     * Get current user
     * @returns {Promise<object>}
     */
    async getMe() {
        const response = await apiClient.get(ENDPOINTS.AUTH.ME);
        return response.data.data;
    },

    /**
     * Request password reset
     * @param {string} email 
     */
    async forgotPassword(email) {
        const response = await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    },

    /**
     * Reset password with token
     * @param {object} data - { email, token, password, password_confirmation }
     */
    async resetPassword(data) {
        const response = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
        return response.data;
    },

    /**
     * Refresh auth token
     */
    async refreshToken() {
        const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH);
        const { access_token } = response.data.data;
        setAuthToken(access_token);
        return access_token;
    },
};

export default authService;

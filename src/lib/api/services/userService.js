import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const userService = {
    /**
     * Get user profile
     * @returns {Promise<object>}
     */
    async getProfile() {
        const response = await apiClient.get(ENDPOINTS.USER.PROFILE);
        return response.data.data;
    },

    /**
     * Update user profile
     * @param {FormData|object} data - Profile data (supports multipart for avatar)
     */
    async updateProfile(data) {
        const isFormData = data instanceof FormData;
        const response = await apiClient.post(ENDPOINTS.USER.UPDATE_PROFILE, data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
        });
        return response.data.data;
    },

    /**
     * Change password
     * @param {object} data - { current_password, password, password_confirmation }
     */
    async changePassword(data) {
        const response = await apiClient.post('/user/password', data);
        return response.data;
    },

    /**
     * Get user preferences
     * @returns {Promise<object>}
     */
    async getPreferences() {
        const response = await apiClient.get(ENDPOINTS.USER.PREFERENCES);
        return response.data.data;
    },

    /**
     * Update user preferences
     * @param {object} data - Preferences data
     */
    async updatePreferences(data) {
        const response = await apiClient.post(ENDPOINTS.USER.UPDATE_PREFERENCES, data);
        return response.data.data;
    },

    /**
     * Delete account
     * @param {string} password - Current password for confirmation
     */
    async deleteAccount(password) {
        const response = await apiClient.delete('/user/account', {
            data: { password },
        });
        return response.data;
    },
};

export default userService;

import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const historyService = {
    /**
     * Get reading history
     * @param {object} params - { page, per_page }
     * @returns {Promise<{data: array, meta: object}>}
     */
    async getHistory(params = {}) {
        const response = await apiClient.get(ENDPOINTS.HISTORY.LIST, { params });
        return response.data;
    },

    /**
     * Record reading progress
     * @param {object} data - { comic_id, chapter_id, page_number }
     */
    async recordProgress(data) {
        const response = await apiClient.post(ENDPOINTS.HISTORY.RECORD, data);
        return response.data.data;
    },

    /**
     * Delete single history entry
     * @param {string} id - History ID
     */
    async deleteEntry(id) {
        const response = await apiClient.delete(ENDPOINTS.HISTORY.DELETE(id));
        return response.data;
    },

    /**
     * Clear all reading history
     */
    async clearAll() {
        const response = await apiClient.delete(ENDPOINTS.HISTORY.CLEAR);
        return response.data;
    },

    /**
     * Get last read chapter for a comic
     * @param {string} comicId - Comic UUID or slug
     * @returns {Promise<{chapter?: object, page_number?: number}>}
     */
    async getLastRead(comicId) {
        try {
            const response = await apiClient.get(`/reading-history/comic/${comicId}`);
            return response.data.data;
        } catch (error) {
            return null;
        }
    },
};

export default historyService;

import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const bookmarkService = {
    /**
     * Get user's bookmarks
     * @param {object} params - { page, per_page }
     * @returns {Promise<{data: array, meta: object}>}
     */
    async getBookmarks(params = {}) {
        const response = await apiClient.get(ENDPOINTS.BOOKMARKS.LIST, { params });
        return response.data;
    },

    /**
     * Add comic to bookmarks
     * @param {string} comicId - Comic UUID or slug
     * @returns {Promise<object>}
     */
    async addBookmark(comicId) {
        const response = await apiClient.post(ENDPOINTS.BOOKMARKS.ADD, {
            comic_id: comicId,
        });
        return response.data.data;
    },

    /**
     * Remove bookmark
     * @param {string} id - Bookmark ID
     */
    async removeBookmark(id) {
        const response = await apiClient.delete(ENDPOINTS.BOOKMARKS.REMOVE(id));
        return response.data;
    },

    /**
     * Check if comic is bookmarked
     * @param {string} comicId - Comic UUID or slug
     * @returns {Promise<{is_bookmarked: boolean, bookmark_id?: string}>}
     */
    async checkBookmark(comicId) {
        const response = await apiClient.get(ENDPOINTS.BOOKMARKS.CHECK(comicId));
        return response.data.data;
    },

    /**
     * Toggle bookmark status
     * @param {string} comicId - Comic UUID or slug
     * @returns {Promise<{is_bookmarked: boolean, bookmark?: object}>}
     */
    async toggleBookmark(comicId) {
        try {
            const { is_bookmarked, bookmark_id } = await this.checkBookmark(comicId);

            if (is_bookmarked && bookmark_id) {
                await this.removeBookmark(bookmark_id);
                return { is_bookmarked: false };
            } else {
                const bookmark = await this.addBookmark(comicId);
                return { is_bookmarked: true, bookmark };
            }
        } catch (error) {
            throw error;
        }
    },
};

export default bookmarkService;

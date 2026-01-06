import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const chapterService = {
    /**
     * Get chapter detail
     * @param {string} id 
     */
    async getChapter(id) {
        const response = await apiClient.get(ENDPOINTS.CHAPTERS.DETAIL(id));
        return response.data.data;
    },

    /**
     * Get chapter pages/images
     * @param {string} id 
     * @param {boolean} translated - Whether to get translated images
     */
    async getPages(id, translated = false) {
        const response = await apiClient.get(ENDPOINTS.CHAPTERS.PAGES(id), {
            params: { translated }
        });
        return response.data.data;
    },

    /**
     * Get chapter with pages (combined)
     * @param {string} id 
     */
    async getChapterWithPages(id) {
        const chapter = await this.getChapter(id);
        const pages = await this.getPages(id);
        return { ...chapter, pages };
    },
};

export default chapterService;

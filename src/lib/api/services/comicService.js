import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const comicService = {
    /**
     * Get comics list with pagination and filters
     * @param {object} params - { page, per_page, status, genre, sort, search }
     */
    async getComics(params = {}) {
        const response = await apiClient.get(ENDPOINTS.COMICS.LIST, { params });
        return response.data;
    },

    /**
     * Get single comic by slug
     * @param {string} slug 
     */
    async getComic(slug) {
        const response = await apiClient.get(ENDPOINTS.COMICS.DETAIL(slug));
        return response.data.data;
    },

    /**
     * Get featured comics
     */
    async getFeatured() {
        const response = await apiClient.get(ENDPOINTS.COMICS.FEATURED);
        return response.data.data;
    },

    /**
     * Get latest updated comics
     * @param {number} limit 
     */
    async getLatest(limit = 12) {
        const response = await apiClient.get(ENDPOINTS.COMICS.LATEST, {
            params: { limit },
        });
        return response.data.data;
    },

    /**
     * Get popular comics
     * @param {number} limit 
     */
    async getPopular(limit = 12) {
        const response = await apiClient.get(ENDPOINTS.COMICS.POPULAR, {
            params: { limit },
        });
        return response.data.data;
    },

    /**
     * Search comics
     * @param {string} query 
     * @param {object} params 
     */
    async search(query, params = {}) {
        const response = await apiClient.get(ENDPOINTS.COMICS.SEARCH, {
            params: { q: query, ...params },
        });
        return response.data;
    },

    /**
     * Get comic chapters
     * @param {string} comicId 
     * @param {object} params 
     */
    async getChapters(comicId, params = {}) {
        const response = await apiClient.get(ENDPOINTS.COMICS.CHAPTERS(comicId), { params });
        return response.data;
    },
};

export default comicService;

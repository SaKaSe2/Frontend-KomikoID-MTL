import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const adminService = {
    // Dashboard
    async getDashboard() {
        const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD);
        return response.data.data;
    },

    async getAnalytics(params = {}) {
        const response = await apiClient.get(ENDPOINTS.ADMIN.ANALYTICS, { params });
        return response.data.data;
    },

    // Comics Management
    async getComics(params = {}) {
        const response = await apiClient.get(ENDPOINTS.ADMIN.COMICS.LIST, { params });
        return response.data;
    },

    async createComic(data) {
        const isFormData = data instanceof FormData;
        const response = await apiClient.post(ENDPOINTS.ADMIN.COMICS.CREATE, data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
        });
        return response.data.data;
    },

    async updateComic(id, data) {
        const isFormData = data instanceof FormData;
        const response = await apiClient.post(ENDPOINTS.ADMIN.COMICS.UPDATE(id), data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
        });
        return response.data.data;
    },

    async deleteComic(id) {
        const response = await apiClient.delete(ENDPOINTS.ADMIN.COMICS.DELETE(id));
        return response.data;
    },

    async getComic(id) {
        const response = await apiClient.get(ENDPOINTS.ADMIN.COMICS.DETAIL(id));
        return response.data.data;
    },

    // Chapters Management
    async getChapters(params = {}) {
        const response = await apiClient.get(ENDPOINTS.ADMIN.CHAPTERS.LIST, { params });
        return response.data;
    },

    async createChapter(data) {
        const isFormData = data instanceof FormData;
        const response = await apiClient.post(ENDPOINTS.ADMIN.CHAPTERS.CREATE, data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
        });
        return response.data.data;
    },

    async updateChapter(id, data) {
        const isFormData = data instanceof FormData;
        const response = await apiClient.post(ENDPOINTS.ADMIN.CHAPTERS.UPDATE(id), data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
        });
        return response.data.data;
    },

    async deleteChapter(id) {
        const response = await apiClient.delete(ENDPOINTS.ADMIN.CHAPTERS.DELETE(id));
        return response.data;
    },

    async getChapter(id) {
        const response = await apiClient.get(ENDPOINTS.ADMIN.CHAPTERS.DETAIL(id));
        return response.data.data;
    },

    async addChapterPages(chapterId, pages) {
        const formData = new FormData();
        pages.forEach(page => formData.append('pages[]', page));
        const response = await apiClient.post(ENDPOINTS.ADMIN.CHAPTERS.ADD_PAGES(chapterId), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    async triggerTranslation(chapterId, targetLanguage = 'id', force = false) {
        const response = await apiClient.post(ENDPOINTS.ADMIN.CHAPTERS.TRANSLATE(chapterId), {
            target_language: targetLanguage,
            force,
        });
        return response.data;
    },

    // Users Management
    async getUsers(params = {}) {
        const response = await apiClient.get(ENDPOINTS.ADMIN.USERS.LIST, { params });
        return response.data;
    },

    async getUser(id) {
        const response = await apiClient.get(ENDPOINTS.ADMIN.USERS.DETAIL(id));
        return response.data.data;
    },

    async updateUser(id, data) {
        const response = await apiClient.put(ENDPOINTS.ADMIN.USERS.UPDATE(id), data);
        return response.data.data;
    },

    // Genres Management
    async getGenres(params = {}) {
        const response = await apiClient.get(ENDPOINTS.ADMIN.GENRES.LIST, { params });
        return response.data;
    },

    async createGenre(data) {
        const response = await apiClient.post(ENDPOINTS.ADMIN.GENRES.CREATE, data);
        return response.data.data;
    },

    async updateGenre(id, data) {
        const response = await apiClient.put(ENDPOINTS.ADMIN.GENRES.UPDATE(id), data);
        return response.data.data;
    },

    async deleteGenre(id) {
        const response = await apiClient.delete(ENDPOINTS.ADMIN.GENRES.DELETE(id));
        return response.data;
    },
};

export default adminService;

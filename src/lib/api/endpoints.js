// API Endpoints
export const ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },

    // Comics
    COMICS: {
        LIST: '/comics',
        DETAIL: (slug) => `/comics/${slug}`,
        FEATURED: '/comics/featured',
        LATEST: '/comics/latest',
        POPULAR: '/comics/popular',
        SEARCH: '/search',
        CHAPTERS: (comicId) => `/comics/${comicId}/chapters`,
    },

    // Chapters
    CHAPTERS: {
        DETAIL: (id) => `/chapters/${id}`,
        PAGES: (id) => `/chapters/${id}/pages`,
    },

    // Genres
    GENRES: {
        LIST: '/genres',
        DETAIL: (slug) => `/genres/${slug}`,
    },

    // User
    USER: {
        PROFILE: '/user',
        UPDATE_PROFILE: '/profile',
        PREFERENCES: '/user/preferences',
        UPDATE_PREFERENCES: '/user/preferences',
    },

    // Bookmarks
    BOOKMARKS: {
        LIST: '/bookmarks',
        ADD: '/bookmarks',
        REMOVE: (id) => `/bookmarks/${id}`,
        CHECK: (comicId) => `/bookmarks/check/${comicId}`,
    },

    // Reading History
    HISTORY: {
        LIST: '/history',
        RECORD: '/history',
        DELETE: (comicSlug) => `/history/${comicSlug}`,
        CLEAR: '/history',
    },

    // Comments
    COMMENTS: {
        LIST: (chapterId) => `/chapters/${chapterId}/comments`,
        CREATE: '/comments',
        UPDATE: (id) => `/comments/${id}`,
        DELETE: (id) => `/comments/${id}`,
    },

    // Ratings
    RATINGS: {
        SUBMIT: '/ratings',
        GET: (comicId) => `/comics/${comicId}/rating`,
    },

    // Admin
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        ANALYTICS: '/admin/analytics',

        COMICS: {
            LIST: '/admin/comics',
            CREATE: '/admin/comics',
            DETAIL: (id) => `/admin/comics/${id}`,
            UPDATE: (id) => `/admin/comics/${id}`,
            DELETE: (id) => `/admin/comics/${id}`,
        },

        CHAPTERS: {
            LIST: '/admin/chapters',
            CREATE: '/admin/chapters',
            DETAIL: (id) => `/admin/chapters/${id}`,
            UPDATE: (id) => `/admin/chapters/${id}`,
            DELETE: (id) => `/admin/chapters/${id}`,
            ADD_PAGES: (id) => `/admin/chapters/${id}/pages`,
            TRANSLATE: (id) => `/admin/chapters/${id}/translate`,
        },

        USERS: {
            LIST: '/admin/users',
            DETAIL: (id) => `/admin/users/${id}`,
            UPDATE: (id) => `/admin/users/${id}`,
        },

        GENRES: {
            LIST: '/admin/genres',
            CREATE: '/admin/genres',
            UPDATE: (id) => `/admin/genres/${id}`,
            DELETE: (id) => `/admin/genres/${id}`,
        },
    },

    // Translation
    TRANSLATION: {
        TRANSLATE: '/translate',
        LANGUAGES: '/translate/languages',
    },
};

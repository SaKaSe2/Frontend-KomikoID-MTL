'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import bookmarkService from '@/lib/api/services/bookmarkService';

/**
 * Hook for managing bookmark state for a specific comic
 * @param {string} comicId - Comic UUID or slug
 */
export function useBookmark(comicId) {
    const { isAuthenticated } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkId, setBookmarkId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // Check bookmark status on mount
    useEffect(() => {
        async function checkStatus() {
            if (!isAuthenticated || !comicId) {
                setChecking(false);
                return;
            }

            try {
                const { is_bookmarked, bookmark_id } = await bookmarkService.checkBookmark(comicId);
                setIsBookmarked(is_bookmarked);
                setBookmarkId(bookmark_id);
            } catch (error) {
                console.error('Failed to check bookmark status:', error);
            } finally {
                setChecking(false);
            }
        }

        checkStatus();
    }, [comicId, isAuthenticated]);

    // Toggle bookmark
    const toggle = useCallback(async () => {
        if (!isAuthenticated) {
            return { success: false, requiresAuth: true };
        }

        setLoading(true);
        try {
            if (isBookmarked && bookmarkId) {
                await bookmarkService.removeBookmark(bookmarkId);
                setIsBookmarked(false);
                setBookmarkId(null);
                return { success: true, isBookmarked: false };
            } else {
                const bookmark = await bookmarkService.addBookmark(comicId);
                setIsBookmarked(true);
                setBookmarkId(bookmark.id);
                return { success: true, isBookmarked: true };
            }
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, [comicId, isAuthenticated, isBookmarked, bookmarkId]);

    return {
        isBookmarked,
        bookmarkId,
        loading,
        checking,
        toggle,
    };
}

export default useBookmark;

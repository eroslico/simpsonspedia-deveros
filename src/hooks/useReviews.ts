import { useState, useEffect, useCallback } from "react";

export interface Review {
  id: string;
  episodeId: number;
  episodeName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const STORAGE_KEY = "simpsonspedia-reviews";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = useCallback((episodeId: number, episodeName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `${episodeId}-${Date.now()}`,
      episodeId,
      episodeName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  }, []);

  const updateReview = useCallback((reviewId: string, rating: number, comment: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, rating, comment } : r
      )
    );
  }, []);

  const deleteReview = useCallback((reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }, []);

  const getReviewsForEpisode = useCallback(
    (episodeId: number) => reviews.filter((r) => r.episodeId === episodeId),
    [reviews]
  );

  const getAverageRating = useCallback(
    (episodeId: number) => {
      const episodeReviews = reviews.filter((r) => r.episodeId === episodeId);
      if (episodeReviews.length === 0) return 0;
      return episodeReviews.reduce((sum, r) => sum + r.rating, 0) / episodeReviews.length;
    },
    [reviews]
  );

  const hasReviewed = useCallback(
    (episodeId: number) => reviews.some((r) => r.episodeId === episodeId),
    [reviews]
  );

  return {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    getReviewsForEpisode,
    getAverageRating,
    hasReviewed,
    totalReviews: reviews.length,
  };
}


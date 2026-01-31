import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  loadMore: (page: number) => Promise<boolean>;
  threshold?: number;
  initialPage?: number;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
  const { loadMore, threshold = 0.1, initialPage = 1 } = options;
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const moreAvailable = await loadMore(nextPage);
      setPage(nextPage);
      setHasMore(moreAvailable);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, loadMore]);

  // Reset logic for external filters/sorts
  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    setIsLoading(false);
  }, [initialPage]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore, hasMore, isLoading, threshold]);

  return {
    hasMore,
    isLoading,
    loadMoreRef,
    reset,
    page
  };
}

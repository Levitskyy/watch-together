import { useState, useEffect } from 'react';
import { getFilteredAnimes } from './actions';
import { AnimePreviewParams, FilterParams } from './utils';

function useLoadItems(initialParams: Partial<FilterParams> = {}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<AnimePreviewParams[]>([]);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState<number>(initialParams.page ? initialParams.page + 1 : 1);
    const [params, setParams] = useState<Partial<FilterParams>>(initialParams);
  
    const loadMore = async () => {
      if (loading || !hasNextPage) return;
  
      setLoading(true);
      try {
        const data: AnimePreviewParams[] = await getFilteredAnimes({ ...params, page });
  
        if (data.length === 0) {
          setHasNextPage(false);
        } else {
          setItems((prevItems) => [...prevItems, ...data]);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadMore();
    }, []);

    useEffect(() => {
        setItems([]);
        setPage(params.page ? params.page + 1 : 1);
        setHasNextPage(true);
    }, [params]);
  
    return { loading, items, hasNextPage, error, loadMore, setParams, setPage };
  }
  
  export default useLoadItems;

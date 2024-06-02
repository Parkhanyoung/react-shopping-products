import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import { SmartURLSearchParams } from "../utils/SmartURLSearchParams";

interface UseInfiniteFetchReturn<T> {
  data: T[];
  isLoading: boolean;
  error: unknown;
  fetchNextPage: () => void;
  refetchByQueryUpdate: (key: string, value: QueryParamValue) => void;
}

export const useInfiniteFetch = <T>(fetcher: Fetcher<T>): UseInfiniteFetchReturn<T> => {
  const { isLoading, error, fetchData } = useFetch<T[]>(fetcher);

  const [data, setData] = useState<T[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [queryParams, setQueryParams] = useState<PagedQueryParams>({ page: 0 });

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await fetchData(new SmartURLSearchParams(queryParams));

      if (!loadedData) return;

      const isInitialFetch = queryParams.page === 0;
      setData(isInitialFetch ? loadedData : [...data, ...loadedData]);
      setHasNextPage(loadedData.length > 0);
    };

    loadData();
  }, [queryParams]);

  const fetchNextPage = () => {
    if (isLoading || error || !hasNextPage) return;

    setQueryParams((prevQueryParams) => ({
      ...prevQueryParams,
      page: prevQueryParams.page + 1,
    }));
  };

  const refetchByQueryUpdate = (key: string, value: QueryParamValue) => {
    setQueryParams({
      ...queryParams,
      [key]: value,
      page: 0,
    });
  };

  return { data, isLoading, error, fetchNextPage, refetchByQueryUpdate };
};

// TODO: 아래의 타입 선언들을 다른 파일로 분리
type PagedQueryParams = QueryParams & { page: number };

type QueryParams = {
  [key: string]: QueryParamValue;
};
type QueryParamValue = string | number | boolean;

type Fetcher<T> = (queryParams?: SmartURLSearchParams) => Promise<T[]>;

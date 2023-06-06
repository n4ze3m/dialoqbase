import { useState, useEffect } from "react";

type QueryParams = {
  [key: string]: string;
};

const useQueryParams = (): QueryParams => {
  const [queryParams, setQueryParams] = useState<QueryParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params: QueryParams = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    setQueryParams(params);
  }, []);

  return queryParams;
};

export default useQueryParams;

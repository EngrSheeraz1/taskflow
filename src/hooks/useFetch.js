import { useState, useEffect } from "react";
import { httpClient } from "../lib/httpClient";

export function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevents state updates if the component unmounts

    async function fetchData() {
      try {
        setIsLoading(true);
        const result = await httpClient(endpoint);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [endpoint]);

  return { data, isLoading, error };
}
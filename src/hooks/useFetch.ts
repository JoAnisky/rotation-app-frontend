import { useState, useEffect } from 'react';

export interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: BodyInit | null;
  credentials : RequestCredentials
}

interface FetchError {
  message: string;
  status?: number;  // Including status could help handle errors based on response status codes
}

const useFetch = <T>(url: string, options?: UseFetchOptions): [T | null, boolean, FetchError | null] => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          method: options?.method || 'GET',
          headers: options?.headers,
          body: options?.body,
          credentials: options?.credentials,
        });
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.message || `Network response was not ok, status: ${response.status}`);
        }
        setData(json);
      } catch (err) {
        // Ensure that any caught error conforms to the FetchError interface
        if (err instanceof Error) {
          setError({ message: err.message });
        } else {
          // Handle cases where the error might not be an instance of Error
          setError({ message: 'An unknown error occurred' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]); // Consider adding 'options' as a dependency if fetch options are dynamic

  return [data, loading, error];
}

export default useFetch;

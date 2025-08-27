import axios from 'axios';
import type { HttpClient, HttpClientConfig } from '@/types/http.ts';

export const createHttpClient = (config: HttpClientConfig): HttpClient => {
  const { baseURL, timeout = 10000 } = config;

  const httpClient = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // TODO - Add an error interceptor to handle errors globally
  // TODO - Add cached responses to avoid redundant network request and improved perfomance

  return {
    get: httpClient.get.bind(httpClient),
    post: httpClient.post.bind(httpClient),
    put: httpClient.put.bind(httpClient),
    delete: httpClient.delete.bind(httpClient),
    patch: httpClient.patch.bind(httpClient),
  };
};

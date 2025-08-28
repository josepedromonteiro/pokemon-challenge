import type { HttpClient, HttpClientConfig } from '@/types/http.ts';

import axios from 'axios';

export const createHttpClient = (config: HttpClientConfig): HttpClient => {
  const { baseURL, timeout = 10000 } = config;

  const httpClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout,
  });

  // TODO - Add an error interceptor to handle errors globally
  // TODO - Add cached responses to avoid redundant network request and improved perfomance

  return {
    delete: httpClient.delete.bind(httpClient),
    get: httpClient.get.bind(httpClient),
    patch: httpClient.patch.bind(httpClient),
    post: httpClient.post.bind(httpClient),
    put: httpClient.put.bind(httpClient),
  };
};

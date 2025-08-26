import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpClientConfig = {
  baseURL: string;
  timeout?: number;
};

export interface HttpClient {
  get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;

  delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;

  put<T = unknown, V = unknown>(
    url: string,
    data?: V,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;

  post<T = unknown, V = unknown>(
    url: string,
    data?: V,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;

  patch<T = unknown, V = unknown>(
    url: string,
    data?: V,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
}

// types/http.ts
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpClient {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = unknown, V = unknown>(url: string, data?: V,  config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = unknown, V = unknown>(url: string, data?: V,  config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = unknown, V = unknown>(url: string, data?: V,  config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    // add post/put/delete if/when needed
}

export type Result<T> =
    | { success: true; status: number; data: T }
    | { success: false; status: number; message: string };

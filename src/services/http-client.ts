import axios, {} from 'axios';
import type {HttpClient} from "@/types/http.ts";

export interface HttpStatusMessage <T = unknown> {
    data?: T;
    message?: string;
    success: boolean;
    status: number;
}

type HttpClientConfig = {
    baseURL?: string;
    timeout?: number;
};

// Cache for offline support
// const cache = new Map<string, { data: any; timestamp: number }>();
// const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function createHttpClient(config: HttpClientConfig = {}): HttpClient {
    const {baseURL = 'https://pokeapi.co/api/v2', timeout = 10000} = config;

    const httpClient = axios.create({
        baseURL,
        timeout,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // // Request interceptor
    // httpClient.interceptors.request.use(
    //     (cfg) => {
    //         const cacheKey = `${cfg.method}-${cfg.url}`;
    //         const cachedData = cache.get(cacheKey);
    //
    //         if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    //             (cfg as any)._cachedResponse = cachedData.data;
    //         }
    //
    //         return cfg;
    //     },
    //     (error) => Promise.reject(error)
    // );
    //
    // // Response interceptor
    // httpClient.interceptors.response.use(
    //     (response) => {
    //         const cacheKey = `${response.config.method}-${response.config.url}`;
    //         cache.set(cacheKey, {
    //             data: response.data,
    //             timestamp: Date.now(),
    //         });
    //
    //         return response;
    //     },
    //     async (error) => {
    //         if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
    //             const cacheKey = `${error.config.method}-${error.config.url}`;
    //             const cachedData = cache.get(cacheKey);
    //
    //             if (cachedData) {
    //                 return {
    //                     data: cachedData.data,
    //                     status: 200,
    //                     statusText: 'OK (Cached)',
    //                     headers: {},
    //                     config: error.config,
    //                     fromCache: true,
    //                 };
    //             }
    //         }
    //         return Promise.reject(error);
    //     }
    // );

    // Return only the surface you need
    return {
        get: httpClient.get.bind(httpClient),
        post: httpClient.post.bind(httpClient),
        put: httpClient.put.bind(httpClient),
        delete: httpClient.delete.bind(httpClient),
        patch: httpClient.patch.bind(httpClient),
    };
}

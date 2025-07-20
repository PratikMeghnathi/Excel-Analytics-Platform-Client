/**
 * @module apiClient
 * @description Axios instance configured with base URL and interceptors.
 */

import axios from "axios";
import { API_BASE_URL } from "@/utils";
import { setupInterceptors } from "./interceptors";

/**
 * Configured Axios instance for API requests
 * @constant {AxiosInstance}
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

//setup request and response interceptors
setupInterceptors(apiClient);

export default apiClient;
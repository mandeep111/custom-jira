'use strict';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * HTTP class for making various HTTP requests using Axios.
 */
export default class Http {
    /**
     * Sends a GET request to the specified URL and returns the response data.
     * @param {string} url - The URL to send the GET request to.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.get(url, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a GET request to the specified URL and returns the response data.
     * @param {string} url - The URL to send the GET request to.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async getAll<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.get(url, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a GET request to the specified URL and returns the response data.
     * @param {string} url - The URL to send the GET request to.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async getContent<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.get(url, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a GET request to the specified URL and returns the response data.
     * @param {string} url - The URL to send the GET request to.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async getById<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.get(url, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a POST request to the specified URL with the provided data.
     * @param {string} url - The URL to send the POST request to.
     * @param {T} data - The data to include in the request.
     * @returns {Promise<U>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async login<T, U>(url: string, data: T): Promise<U> {
        try {
            const response: AxiosResponse<U> = await axios.post(url, data);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a POST request to the specified URL with the provided data.
     * @param {string} url - The URL to send the POST request to.
     * @param {T} data - The data to include in the request.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async create<T>(url: string, data: T, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.post(url, data, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a POST request to the specified URL with the provided data.
     * @param {string} url - The URL to send the POST request to.
     * @param {T} data - The data to include in the request.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async upload<T>(url: string, data: T, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.post(url, data, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a PUT request to the specified URL with the provided data.
     * @param {string} url - The URL to send the PUT request to.
     * @param {T} data - The data to include in the request.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async update<T>(url: string, data: T, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.put(url, data, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a PATCH request to the specified URL with the provided data.
     * @param {string} url - The URL to send the PATCH request to.
     * @param {T} data - The data to include in the request.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async change<T>(url: string, data: T, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.patch(url, data, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a POST request to the specified URL with the provided data.
     * @param {string} url - The URL to send the POST request to.
     * @param {T} data - The data to include in the request.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async duplicate<T>(url: string, data: T, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.post(url, data, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a DELETE request to the specified URL and returns the response data.
     * @param {string} url - The URL to send the DELETE request to.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async remove<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.delete(url, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sends a PATCH request to the specified URL with no data (used for disabling).
     * @param {string} url - The URL to send the PATCH request to.
     * @param {AxiosRequestConfig} config - (Optional) Axios request configuration.
     * @returns {Promise<T>} - A promise that resolves with the response data.
     * @throws {Error} - If an error occurs during the request.
     */
    static async disabled<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.patch(url, null, config);
            return response.data;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }

    /**
     * Sets the "Authorization" header for Axios requests, typically used for authentication.
     * @param {string} token - The authentication token to be included in the "Authorization" header.
     * @throws {Error} - If an error occurs while setting the header.
     */
    static authentication(token: string): void {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            throw new Error(`An error occurred: ${error as string}`);
        }
    }
}

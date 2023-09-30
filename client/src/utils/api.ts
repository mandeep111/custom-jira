/**
 * Represents the base URL for the API endpoints.
 * @constant {string}
 */
export const BASE_URL: string = import.meta.env.VITE_BASE_URL;

/**
 * Represents the types of API endpoints available in the application.
 * @interface APITypes
 */
export interface APITypes {
    AUTHENTICATION: string;
    SPACE: string;
    PROJECT: string;
    TASK: string;
}

/**
 * Represents the API object that contains URLs for various endpoints.
 * @constant {APITypes}
 */
export const API: APITypes = {
    AUTHENTICATION: `${BASE_URL}/v1/user/login`,
    SPACE: `${BASE_URL}/v1/space`,
    PROJECT: `${BASE_URL}/v1/project`,
    TASK: `${BASE_URL}/v1/task`,
};
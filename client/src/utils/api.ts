/**
 * Represents the base URL for the API endpoints.
 * @constant {string}
 */
export const BASE_URL: string = import.meta.env.VITE_SERVER_URL;

/**
 * Represents the types of API endpoints available in the application.
 * @interface APITypes
 */
export interface APITypes {
    AUTHENTICATION: string;
    SPACE: string;
    PROJECT: string;
    FOLDER: string;
    TASK: string;
    SUBTASK: string;
    TASK_STAGE: string;
    USER: string;
    FORM: string;
    USER_PROFILE: string;
}

/**
 * Represents the API object that contains URLs for various endpoints.
 * @constant {APITypes}
 */
export const API: APITypes = {
    AUTHENTICATION: `${BASE_URL}/v1/login`,
    SPACE: `${BASE_URL}/v1/space`,
    PROJECT: `${BASE_URL}/v1/project`,
    FOLDER: `${BASE_URL}/v1/folder`,
    TASK: `${BASE_URL}/v1/task`,
    SUBTASK: `${BASE_URL}/v1/sub-task`,
    TASK_STAGE: `${BASE_URL}/v1/task-stage`,
    USER: `${BASE_URL}/v1/user`,
    FORM: `${BASE_URL}/forms`,
    USER_PROFILE: `${BASE_URL}/v1/user-profile`,
};
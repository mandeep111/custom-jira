export { };

/**
 * This file declares global variables and interfaces used throughout the application.
 * 
 * @remarks
 * The global variables declared in this file include APP_TITLE, SERVER_URL, WORKFLOW_ENABLED, WORKFLOW_SERVER_URL, and SERVER.
 * The interfaces declared in this file include Server, APITypes, and PageProps.
 * These variables and interfaces are used in various places throughout the application, such as API requests, WebSocket connections, and page components.
 */
declare global {

    /**
     * The title of the application.
     *
     * @remarks
     * This variable is a string that represents the title of the application.
     * It is used in various places throughout the application, such as the browser tab title and the header of the application.
     */
    const APP_TITLE: string;

    /**
     * The URL of the server that the application communicates with.
     *
     * @remarks
     * This variable is a string that represents the URL of the server that the application communicates with.
     * It is used in various places throughout the application, such as API requests and WebSocket connections.
     */
    const SERVER_URL: string;

    /**
     * Indicates whether the workflow feature is enabled.
     *
     * @remarks
     * This variable is a boolean that indicates whether the workflow feature is enabled.
     * If it is enabled, the application will display additional UI elements and make additional API requests related to workflow.
     */
    const WORKFLOW_ENABLED: boolean;

    /**
     * The URL of the workflow server that the application communicates with.
     *
     * @remarks
     * This variable is a string that represents the URL of the workflow server that the application communicates with.
     * It is used in various places throughout the application, such as API requests related to workflow.
     */
    const WORKFLOW_SERVER_URL: string;

    /**
     * Represents the server configuration for the application.
     *
     * @remarks
     * This variable is an instance of the `Server` interface and contains information about the server configuration, including its URL and API types.
     * It is used to make API requests and interact with the server.
     */
    const SERVER: Server;

    /**
     * Represents the properties of a server.
     *
     * @interface Server
     * @property {string} URL - The URL of the server.
     * @property {APITypes} API - An object containing API type strings.
     */
    interface Server {
        URL: string;
        API: APITypes;
    }

    /**
     * Represents different API types.
     *
     * @interface APITypes
     * @property {string} AUTHENTICATION - Represents the authentication API type.
     * @property {string} SPACE - Represents the space API type.
     * @property {string} PROJECT - Represents the project API type.
     * @property {string} FOLDER - Represents the folder API type.
     * @property {string} TASK - Represents the task API type.
     * @property {string} SUBTASK - Represents the subtask API type.
     * @property {string} TASKSTAGE - Represents the task stage API type.
     * @property {string} USER - Represents the user API type.
     * @property {string} FORM - Represents the form API type.
     * @property {string} USERPROFILE - Represents the user profile API type.
     */
    interface APITypes {
        AUTHENTICATION: string;
        SPACE: string;
        PROJECT: string;
        FOLDER: string;
        TASK: string;
        SUBTASK: string;
        TASKSTAGE: string;
        USER: string;
        FORM: string;
        USERPROFILE: string;
    }

    /**
     * Represents the response object returned by the API.
     * 
     * @interface APIResponse<T>
     * @property {T[]} content - The content of the API response.
     * @property {number} pageNo - The page number in the API response.
     * @property {number} pageSize - The page size in the API response.
     * @property {number} totalElements - The total number of elements in the API response.
     * @property {number} totalPages - The total number of pages in the API response.
     * @property {boolean} last - Indicates whether the current page is the last page in the API response.
     */
    interface APIResponse<T> {
        content: T[];
        pageNo: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        last: boolean;
    }

    /**
     * Represents properties for a page component.
     *
     * @interface PageProps
     * @property {boolean} isReady - Indicates whether the page is ready for display.
     */
    interface PageProps {
        isReady: boolean;
    }
}


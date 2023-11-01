/**
 * Represents an API response with the following properties:
 * @property {T[]} content - An array of content of type T, typically representing the response data.
 * @property {number} pageNo - The current page number of the response.
 * @property {number} pageSize - The number of items per page in the response.
 * @property {number} totalElements - The total number of elements available.
 * @property {number} totalPages - The total number of pages in the response.
 * @property {boolean} last - Indicates whether this is the last page of data.
 */
export type ApiResponse<T> = {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

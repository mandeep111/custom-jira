/**
 * @description Represents a space.
 * @interface Space
 * 
 * @property {number | null} id - The unique identifier of the space, or null if not available.
 * @property {string} name - The name of the space.
 * @property {string} color - The color associated with the space.
 * @property {string} url - The URL associated with the space.
 */
export interface Space {
    id: number | null;
    name: string;
    color: string;
    url: string;
}

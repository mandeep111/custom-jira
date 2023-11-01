/**
 * Represents a tag with the following properties:
 * @property {number | null} id - The unique identifier for the tag. It can be a number or null.
 * @property {string} name - The name of the tag.
 * @property {string} description - A description of the tag.
 * @property {boolean} isActive - Indicates whether the tag is currently active or not.
 */
export type Tags = {
    id: number | null;
    name: string;
    description: string;
    isActive: boolean;
}

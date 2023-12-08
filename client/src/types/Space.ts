/**
 * Represents a space with the following properties
 * 
 * @property {number | null} id - The unique identifier for the space. It can be a number or null.
 * @property {string} name - The name of the space.
 * @property {string | undefined} tags - Tags associated with the space (optional).
 * @property {string} color - The color associated with the space.
 * @property {string} url - The URL of the space.
 * @property {Project[] | undefined} projects - An array of projects associated with the space (optional).
 * @property {Folder[] | undefined} folders - An array of folders associated with the space (optional).
 * @property {Assign[]} assignee - An array of assignees associated with the space.
 * @property {boolean} isPrivate - Indicates whether the space is private or not.
 * @property {boolean | undefined} isOpen - Indicates whether the space is open or not (optional).
 * @property {boolean | undefined} isFavorite - Indicates whether the space is marked as a favorite (optional).
 */
type Space = {
    id: number | null;
    name: string;
    tags?: string;
    color: string;
    url: string;
    projects?: Project[];
    folders?: Folder[];
    assignee: Assign[];
    isPrivate: boolean;
    isOpen?: boolean;
    isFavorite?: boolean;
}

/**
 * Represents a folder with the following properties
 * 
 * @property {number | null} id - The unique identifier for the folder (optional).
 * @property {string} name - The name of the folder.
 * @property {number | null} spaceId - The identifier of the space to which the folder belongs.
 * @property {string | undefined} spaceName - The name of the space (optional).
 * @property {string | undefined} spaceUrl - The URL of the space (optional).
 * @property {Project[] | undefined} project - An array of projects associated with the folder (optional).
 * @property {boolean | undefined} isActive - Indicates whether the folder is active or not (optional).
 */
type Folder = {
    id?: number | null;
    name: string;
    spaceId: number | null;
    spaceName?: string;
    spaceUrl?: string;
    project?: Project[];
    isActive?: boolean;
}

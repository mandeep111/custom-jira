/**
 * Represents a project with the following properties
 * 
 * @property {number | null} id - The unique identifier for the project. It can be a number or null.
 * @property {number | null} companyId - The identifier of the company to which the project belongs (optional).
 * @property {string | undefined} companyName - The name of the company (optional).
 * @property {number | null} spaceId - The identifier of the space to which the project belongs.
 * @property {string | undefined} spaceName - The name of the space (optional).
 * @property {number | null} folderId - The identifier of the folder to which the project belongs.
 * @property {string | undefined} folderName - The name of the folder (optional).
 * @property {number | null} userId - The identifier of the user associated with the project (optional).
 * @property {string | undefined} userName - The name of the user (optional).
 * @property {number} stageId - The identifier of the stage to which the project belongs.
 * @property {string | undefined} stageName - The name of the stage (optional).
 * @property {string} color - The color associated with the project.
 * @property {string} name - The name of the project.
 * @property {string} url - The URL of the project.
 * @property {string | undefined} label - A label associated with the project (optional).
 * @property {string | undefined} description - A description of the project (optional).
 * @property {number | undefined} progress - The progress of the project (optional).
 * @property {Date | string | null} start - The start date of the project (optional).
 * @property {Date | string | null} end - The end date of the project (optional).
 * @property {string | undefined} lastUpdateStatus - The status of the last update (optional).
 * @property {string | undefined} allocatedHours - The allocated hours for the project (optional).
 * @property {TaskStage[]} taskStages - An array of task stages associated with the project.
 * @property {Task[] | undefined} tasks - An array of tasks associated with the project (optional).
 * @property {boolean | undefined} recurringAllowed - Indicates whether recurring tasks are allowed (optional).
 * @property {boolean} isPrivate - Indicates whether the project is private or not.
 * @property {boolean | undefined} isFavorite - Indicates whether the project is marked as a favorite (optional).
 * @property {boolean | undefined} isActive - Indicates whether the project is active or not (optional).
 */
type Project = {
    id: number | null;
    companyId?: number | null;
    companyName?: string;
    spaceId: number | null;
    spaceName?: string;
    folderId: number | null;
    folderName?: string;
    userId: number | null;
    userName?: string;
    stageId: number;
    stageName?: string;
    color: string;
    name: string;
    url: string;
    label?: string;
    description?: string;
    progress?: number;
    start?: Date | string | null;
    end?: Date | string | null;
    lastUpdateStatus?: string;
    allocatedHours?: string;
    taskStages: TaskStage[];
    tasks?: Task[];
    recurringAllowed?: boolean;
    isPrivate: boolean;
    isFavorite?: boolean;
    isActive?: boolean;
}

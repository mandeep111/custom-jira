/**
 * Represents a task with the following properties
 * 
 * @property {number | null} id - The unique identifier for the task (optional).
 * @property {number | null} spaceId - The identifier of the space to which the task belongs (optional).
 * @property {string | undefined} spaceName - The name of the space (optional).
 * @property {number | null} projectId - The identifier of the project to which the task belongs.
 * @property {string | undefined} projectName - The name of the project (optional).
 * @property {number} taskStageId - The identifier of the task stage to which the task belongs.
 * @property {string | undefined} taskStageName - The name of the task stage (optional).
 * @property {string} name - The name of the task.
 * @property {string} color - The color associated with the task.
 * @property {string} description - A description of the task.
 * @property {Priority} priority - The priority level of the task, based on the Priority enum.
 * @property {number | undefined} progress - The progress of the task (optional).
 * @property {Tags[]} tags - An array of tags associated with the task.
 * @property {SubTask[] | undefined} subTasks - An array of sub-tasks associated with the task (optional).
 * @property {string | undefined} type - The type of the task (optional).
 * @property {Status | undefined} progressStatus - The status of the task's progress, based on the Status enum (optional).
 * @property {boolean | undefined} blocked - Indicates whether the task is blocked or not (optional).
 * @property {boolean | undefined} closed - Indicates whether the task is closed or not (optional).
 * @property {Date | string | null} start - The start date of the task (optional).
 * @property {Date | string | null} end - The end date of the task (optional).
 * @property {Assign[]} assignee - An array of assignees associated with the task.
 * @property {string | undefined} url - The URL of the task (optional).
 *
 */
type Task = {
    id?: number | null;
    spaceId?: number | null;
    spaceName?: string;
    projectId: number | null;
    projectName?: string;
    taskStageId: number;
    taskStageName?: string;
    name: string;
    color: string;
    description: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    progress?: number;
    tags: Tags[];
    subTasks?: Subtask[];
    type?: string;
    progressStatus?: 'WAITING' | 'COMPLETED' | 'DOING' | 'CANCELLED';
    blocked?: boolean;
    closed?: boolean;
    start?: Date | string | null;
    end?: Date | string | null;
    assignee: Assign[];
    url?: string;
}

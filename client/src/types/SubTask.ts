import { Priority } from '../enum/Priority';
import { Status } from '../enum/Status';
import { Assign } from './Assign';

/**
 * Represents a sub-task with the following properties:
 * @property {number | null} id - The unique identifier for the sub-task (optional).
 * @property {number | null} taskId - The identifier of the parent task to which the sub-task belongs.
 * @property {string | undefined} taskName - The name of the parent task (optional).
 * @property {number | undefined} projectId - The identifier of the project to which the sub-task belongs (optional).
 * @property {string | undefined} projectName - The name of the project (optional).
 * @property {number | undefined} spaceId - The identifier of the space to which the sub-task belongs (optional).
 * @property {string | undefined} spaceName - The name of the space (optional).
 * @property {string} name - The name of the sub-task.
 * @property {string} color - The color associated with the sub-task.
 * @property {string} description - A description of the sub-task.
 * @property {Priority} priority - The priority level of the sub-task, based on the Priority enum.
 * @property {string | undefined} type - The type of the sub-task (optional).
 * @property {Status} status - The status of the sub-task, based on the Status enum.
 * @property {number | null} formId - The identifier of the associated form (optional).
 * @property {boolean} needApproval - Indicates whether approval is needed for the sub-task.
 * @property {string} requestCode - The request code for the sub-task.
 * @property {string | undefined} url - The URL associated with the sub-task (optional).
 * @property {Date | string | null} start - The start date of the sub-task (optional).
 * @property {Date | string | null} end - The end date of the sub-task (optional).
 * @property {number | null} assigneeId - The identifier of the assignee for the sub-task (optional).
 * @property {Assign | undefined} assignee - The assignee information (optional).
 */
export type SubTask = {
    id?: number | null;
    taskId: number | null;
    taskName?: string;
    projectId?: number;
    projectName?: string;
    spaceId?: number;
    spaceName?: string;
    name: string;
    color: string;
    description: string;
    priority: Priority;
    type?: string;
    status: Status;
    formId: number | null;
    needApproval: boolean;
    requestCode: string;
    url?: string;
    start: Date | string | null;
    end: Date | string | null;
    assigneeId: number | null;
    assignee?: Assign;
}

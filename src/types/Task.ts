/**
 * @description Interface for the task stage.
 * @interface TaskStage
 * 
 * @property {number | null} id - The unique identifier of the task stage, or null if not available.
 * @property {string} name - The name of the task stage.
 * @property {string} color - The color associated with the task stage.
 */
export interface TaskStage {
    id: number | null;
    name: string;
    color: string;
}

/**
 * @description Interface for a task.
 * @interface Task
 * 
 * @property {number} id - The unique identifier of the task.
 * @property {number} taskStageId - The identifier of the task's stage.
 * @property {string} taskStageName - The name of the task's stage.
 * @property {number} projectId - The identifier of the project to which the task belongs.
 * @property {User[]} assignees - An array of users assigned to the task.
 * @property {[]} tags - An array of tags associated with the task (empty array for now).
 * @property {string} name - The name of the task.
 * @property {string} description - A description of the task.
 * @property {string} color - The color associated with the task.
 * @property {Date} start - The start date of the task.
 * @property {Date} end - The end date of the task.
 * @property {string} type - The type of the task.
 * @property {boolean} isDisabled - Indicates whether the task is disabled.
 * @property {number} progress - The progress of the task.
 * @property {SubTask[]} subTasks - An array of sub-tasks associated with the task.
 */
export interface Task {
    id: number;
    taskStageId: number;
    taskStageName: string;
    projectId: number;
    assignees: User[];
    tags: [];
    name: string;
    description: string;
    color: string;
    start: Date;
    end: Date;
    type: string;
    isDisabled: boolean;
    progress: number;
    subTasks: SubTask[];
}

/**
 * @description Interface for a sub-task.
 * @interface SubTask
 * 
 * @property {number} id - The unique identifier of the sub-task.
 * @property {number} taskId - The identifier of the task to which the sub-task belongs.
 * @property {string} taskName - The name of the task.
 * @property {number} projectId - The identifier of the project to which the sub-task belongs.
 * @property {string} projectName - The name of the project.
 * @property {string} name - The name of the sub-task.
 * @property {string} color - The color associated with the sub-task.
 * @property {string} description - A description of the sub-task.
 * @property {User} assignee - The user assigned to the sub-task.
 * @property {string} type - The type of the sub-task.
 * @property {string} status - The status of the sub-task.
 * @property {boolean} closed - Indicates whether the sub-task is closed.
 * @property {boolean} blocked - Indicates whether the sub-task is blocked.
 * @property {string} end - The end date of the sub-task.
 * @property {string} start - The start date of the sub-task.
 */
export interface SubTask {
    id: number;
    taskId: number;
    taskName: string;
    projectId: number;
    projectName: string;
    name: string;
    color: string;
    description: string;
    assignee: User;
    type: string;
    status: string;
    closed: boolean;
    blocked: boolean;
    end: string;
    start: string;
}

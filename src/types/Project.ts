import { Task, TaskStage } from './Task';

/**
 * @description Represents a project.
 * @interface Project
 * 
 * @property {number | null} id - The unique identifier of the project, or null if not available.
 * @property {string} stageName - The stage name of the project.
 * @property {string} color - The color associated with the project.
 * @property {string} name - The name of the project.
 * @property {TaskStage[]} taskStages - An array of task stages associated with the project.
 * @property {Task[]} tasks - An array of tasks within the project.
 * @property {string} url - The URL associated with the project.
 */
export interface Project {
    id: number | null;
    stageName: string;
    color: string;
    name: string;
    taskStages: TaskStage[];
    tasks: Task[];
    url: string;
}
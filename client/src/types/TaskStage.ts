/**
 * Represents a task stage with the following properties:
 * @property {number | null} id - The unique identifier for the task stage. It can be a number or null.
 * @property {number | null} userId - The identifier of the user associated with this stage (optional).
 * @property {string | undefined} userName - The name of the user associated with this stage (optional).
 * @property {string | undefined} name - The name of the task stage (optional).
 * @property {string | undefined} description - A description of the task stage (optional).
 * @property {string | undefined} color - The color associated with the task stage (optional).
 * @property {boolean | undefined} fold - Indicates whether the task stage is folded or not (optional).
 * @property {boolean | undefined} isActive - Indicates whether the task stage is currently active or not (optional).
 */
export type TaskStage = {
    id: number | null;
    userId?: number | null;
    userName?: string;
    name?: string;
    description?: string;
    color?: string;
    fold?: boolean;
    isActive?: boolean;
}

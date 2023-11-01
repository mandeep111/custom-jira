/**
 * Represents an assignment with the following properties:
 * @property {number | null} id - The unique identifier for the assignment. It can be a number or null.
 * @property {string | undefined} email - The email address of the assignee (optional).
 * @property {string | undefined} password - The password of the assignee (optional).
 * @property {string} fullName - The full name of the assignee.
 */
export type Assign = {
    id: number | null;
    email?: string;
    password?: string;
    fullName: string;
}

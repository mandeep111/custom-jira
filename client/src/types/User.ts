/**
 * Represents a user object with the following properties:
 * @property {number | null} id - The unique identifier for the user. It can be a number or null.
 * @property {string | undefined} email - The email address associated with the user (optional).
 * @property {string | undefined} password - The user's password (optional).
 * @property {string} fullName - The full name of the user.
 */
export type User = {
    id: number | null;
    email?: string;
    password?: string;
    fullName: string;
}

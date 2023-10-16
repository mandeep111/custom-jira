export { };

declare global {

    /**
     * Represents properties for a page component.
     *
     * @interface PageProps
     * @property {boolean} isReady - Indicates whether the page is ready for display.
     */
    interface PageProps {
        isReady: boolean;
    }

    /**
     * Represents user information.
     *
     * @interface User
     * @property {number | null} id - The unique identifier of the user, or null if not available.
     * @property {string} fullName - The full name of the user.
     * @property {string} email - The email address of the user.
     */
    interface User {
        id: number | null;
        fullName: string;
        email: string;
    }

}
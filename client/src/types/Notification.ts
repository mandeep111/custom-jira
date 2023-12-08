/**
 * Represents a tag with the following properties
 * 
 * @property {string} createdBy - The createdBy of the tag.
 * @property {string} updatedBy - A updatedBy of the tag.
 * @property {string} creationDate - The creationDate of the tag.
 * @property {string} updatedDate - A updatedDate of the tag.
 * @property {number | null} id - The unique identifier for the tag. It can be a number or null.
 * @property {string} recipient - The recipient of the tag.
 * @property {string} subject - A subject of the tag.
 * @property {string} body - The body of the tag.
 * @property {boolean} isRead - Indicates whether the tag is currently active or not.
 * @property {boolean} isSent - Indicates whether the tag is currently active or not.
 * @property {boolean} active - Indicates whether the tag is currently active or not.
 */
type Notify = {
    createdBy: string;
    updatedBy: string;
    creationDate: string;
    updatedDate: string;
    id: number | null;
    recipient: string;
    subject: string;
    body: string;
    url: string;
    isRead: boolean;
    isSent: boolean;
    active: boolean;
}


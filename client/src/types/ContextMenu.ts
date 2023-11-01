/**
 * Represents a context menu item with the following properties:
 * @property {string} title - The title or label of the context menu item.
 * @property {() => void | undefined} fnc - A function to be executed when the context menu item is clicked (optional).
 * @property {() => JSX.Element} icon - A function that returns a JSX element representing the icon for the context menu item.
 * @property {string} class - The CSS class for styling the context menu item.
 * @property {ContextMenu[]} child - An array of child context menu items.
 * @property {boolean} break - Indicates whether a line break should be inserted after this context menu item.
 */
export type ContextMenu = {
    title: string;
    fnc?: () => void;
    icon: () => JSX.Element;
    class: string;
    child: ContextMenu[];
    break: boolean;
}

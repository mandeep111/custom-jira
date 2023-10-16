/**
 * @description Interface for a context menu item.
 * @interface ContextMenu
 * 
 * @property {string} title - The title of the context menu item.
 * @property {() => void} [fnc] - The function to execute when the item is clicked.
 * @property {() => JSX.Element} icon - A function returning JSX.Element representing the icon for the item.
 * @property {string} class - The CSS class for styling the item.
 * @property {ContextMenu[]} child - An array of child context menu items.
 * @property {boolean} break - Indicates whether a line break should be added after the item.
 */
export interface ContextMenu {
    title: string;
    fnc?: () => void;
    icon: () => JSX.Element;
    class: string;
    child: ContextMenu[];
    break: boolean;
}
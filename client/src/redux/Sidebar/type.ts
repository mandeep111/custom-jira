export interface State {
    spaceId: number | null;
    spaceUrl: string;
    spaceName: string;
    projectId: number | null;
    projectUrl: string;
    projectName: string;
    folderId: number | null;
    folderName: string;
    toggle: boolean;
    mouseX: number | null;
    mouseY: number | null;
}

export enum Action {
    SET_SPACE_ID = 'SET_SPACE_ID',
    SET_SPACE_URL = 'SET_SPACE_URL',
    SET_SPACE_NAME = 'SET_SPACE_NAME',
    SET_PROJECT_ID = 'SET_PROJECT_ID',
    SET_PROJECT_URL = 'SET_PROJECT_URL',
    SET_PROJECT_NAME = 'SET_PROJECT_NAME',
    SET_FOLDER_ID = 'SET_FOLDER_ID',
    SET_FOLDER_NAME = 'SET_FOLDER_NAME',
    SET_TOGGLE = 'SET_TOGGLE',
    SET_MOUSE_X = 'SET_MOUSE_X',
    SET_MOUSE_Y = 'SET_MOUSE_Y'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
import { Action } from './type';

export const setSpaceId = (spaceId: number | null) => {
    return {
        type: Action.SET_SPACE_ID,
        payload: spaceId
    };
};

export const setSpaceUrl = (spaceUrl: string | null) => {
    return {
        type: Action.SET_SPACE_URL,
        payload: spaceUrl
    };
};

export const setSpaceName = (spaceName: string | null) => {
    return {
        type: Action.SET_SPACE_NAME,
        payload: spaceName
    };
};

export const setProjectId = (projectId: number | null) => {
    return {
        type: Action.SET_PROJECT_ID,
        payload: projectId
    };
};

export const setProjectUrl = (projectUrl: string | null) => {
    return {
        type: Action.SET_PROJECT_URL,
        payload: projectUrl
    };
};

export const setProjectName = (projectName: string | null) => {
    return {
        type: Action.SET_PROJECT_NAME,
        payload: projectName
    };
};

export const setFavoriteSpace = (isFavorite: boolean) => {
    return {
        type: Action.SET_FAVORITE_SPACE,
        payload: isFavorite
    };
};

export const setFavoriteProject = (isFavorite: boolean) => {
    return {
        type: Action.SET_FAVORITE_PROJECT,
        payload: isFavorite
    };
};

export const setFolderId = (folderId: number | null) => {
    return {
        type: Action.SET_FOLDER_ID,
        payload: folderId
    };
};

export const setFolderName = (folderName: string | null) => {
    return {
        type: Action.SET_FOLDER_NAME,
        payload: folderName
    };
};

export const setToggle = (toggle: boolean | null) => {
    return {
        type: Action.SET_TOGGLE,
        payload: toggle
    };
};

export const setMouseX = (mouseX: number | null) => {
    return {
        type: Action.SET_MOUSE_X,
        payload: mouseX
    };
};

export const setMouseY = (mouseY: number | null) => {
    return {
        type: Action.SET_MOUSE_Y,
        payload: mouseY
    };
};

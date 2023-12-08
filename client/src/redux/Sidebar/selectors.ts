import { RootState } from '../rootReducer';

export const getSpaceId = (state: RootState) => {
    return state.sidebar.spaceId;
};

export const getSpaceUrl = (state: RootState) => {
    return state.sidebar.spaceUrl;
};

export const getSpaceName = (state: RootState) => {
    return state.sidebar.spaceName;
};

export const getProjectId = (state: RootState) => {
    return state.sidebar.projectId;
};

export const getProjectUrl = (state: RootState) => {
    return state.sidebar.projectUrl;
};

export const getProjectName = (state: RootState) => {
    return state.sidebar.projectName;
};

export const getFavoriteSpace = (state: RootState) => {
    return state.sidebar.favoriteSpace;
};

export const getFavoriteProject = (state: RootState) => {
    return state.sidebar.favoriteProject;
};

export const getFolderId = (state: RootState) => {
    return state.sidebar.folderId;
};

export const getFolderName = (state: RootState) => {
    return state.sidebar.folderName;
};

export const getToggle = (state: RootState) => {
    return state.sidebar.toggle;
};

export const getMouseX = (state: RootState) => {
    return state.sidebar.mouseX;
};

export const getMouseY = (state: RootState) => {
    return state.sidebar.mouseY;
};
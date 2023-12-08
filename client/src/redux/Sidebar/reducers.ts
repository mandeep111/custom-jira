import { Action, ActionInterface, State } from './type';

const initialState = {
    spaceId: null,
    spaceUrl: '',
    spaceName: '',
    projectId: null,
    projectUrl: '',
    projectName: '',
    favoriteSpace: false,
    favoriteProject: false,
    folderId: null,
    folderName: '',
    toggle: false,
    mouseX: null,
    mouseY: null
};

const sidebarReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case Action.SET_SPACE_ID:
            return {
                ...state,
                spaceId: action.payload
            };
        case Action.SET_SPACE_URL:
            return {
                ...state,
                spaceUrl: action.payload
            };
        case Action.SET_SPACE_NAME:
            return {
                ...state,
                spaceName: action.payload
            };
        case Action.SET_PROJECT_ID:
            return {
                ...state,
                projectId: action.payload
            };
        case Action.SET_PROJECT_URL:
            return {
                ...state,
                projectUrl: action.payload
            };
        case Action.SET_PROJECT_NAME:
            return {
                ...state,
                projectName: action.payload
            };
        case Action.SET_FAVORITE_SPACE:
            return {
                ...state,
                favoriteSpace: action.payload
            };
        case Action.SET_FAVORITE_PROJECT:
            return {
                ...state,
                favoriteProject: action.payload
            };
        case Action.SET_FOLDER_ID:
            return {
                ...state,
                folderId: action.payload
            };
        case Action.SET_FOLDER_NAME:
            return {
                ...state,
                folderName: action.payload
            };
        case Action.SET_TOGGLE:
            return {
                ...state,
                toggle: action.payload
            };
        case Action.SET_MOUSE_X:
            return {
                ...state,
                mouseX: action.payload
            };
        case Action.SET_MOUSE_Y:
            return {
                ...state,
                mouseY: action.payload
            };
        default:
            return state;
    }
};

export default sidebarReducer;
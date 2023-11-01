import { Action, ActionInterface, State } from './type';

const initialState = {
    isOpenFormNewSpace: false,
    isOpenFormNewProject: false,
    isOpenFormNewFolder: false,
    isOpenFormNewTask: false,
    isOpenFormNewSubTask: false,
    isOpenFormTaskDetail: false,
    isOpenFormSubTaskDetail: false,
    isOpenFormRenameSpace: false,
    isOpenFormChangeColorSpace: false,
    isOpenFormPlatformShare: false,
    isOpenFormRenameProject: false,
    isOpenFormMoveProject: false,
    isOpenFormRenameFolder: false,
    isOpenFormMoveFolder: false,
    isOpenFormOpenFolder: false,
    isOpenFormEditSpace: false,
    isOpenFormChangeColorProject: false
};

const dialogReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case Action.SET_OPEN_FORM_NEW_SPACE:
            return {
                ...state,
                isOpenFormNewSpace: action.payload
            };
        case Action.SET_OPEN_FORM_NEW_PROJECT:
            return {
                ...state,
                isOpenFormNewProject: action.payload
            };
        case Action.SET_OPEN_FORM_NEW_FOLDER:
            return {
                ...state,
                isOpenFormNewFolder: action.payload
            };
        case Action.SET_OPEN_NEW_TASK:
            return {
                ...state,
                isOpenFormNewTask: action.payload
            };
        case Action.SET_OPEN_FORM_NEW_SUB_TASK:
            return {
                ...state,
                isOpenFormNewSubTask: action.payload
            };
        case Action.SET_OPEN_FORM_TASK_DETAIL:
            return {
                ...state,
                isOpenFormTaskDetail: action.payload
            };
        case Action.SET_OPEN_FORM_SUB_TASK_DETAIL:
            return {
                ...state,
                isOpenFormSubTaskDetail: action.payload
            };
        case Action.SET_OPEN_FORM_RENAME_SPACE:
            return {
                ...state,
                isOpenFormRenameSpace: action.payload
            };
        case Action.SET_OPEN_FORM_CHANGE_COLOR_SPACE:
            return {
                ...state,
                isOpenFormChangeColorSpace: action.payload
            };
        case Action.SET_OPEN_FORM_PLATFORM_SHARE:
            return {
                ...state,
                isOpenFormPlatformShare: action.payload
            };
        case Action.SET_OPEN_FORM_RENAME_PROJECT:
            return {
                ...state,
                isOpenFormRenameProject: action.payload
            };
        case Action.SET_OPEN_FORM_MOVE_PROJECT:
            return {
                ...state,
                isOpenFormMoveProject: action.payload
            };
        case Action.SET_OPEN_FORM_RENAME_FOLDER:
            return {
                ...state,
                isOpenFormRenameFolder: action.payload
            };
        case Action.SET_OPEN_FORM_MOVE_FOLDER:
            return {
                ...state,
                isOpenFormMoveFolder: action.payload
            };
        case Action.SET_OPEN_FORM_OPEN_FOLDER:
            return {
                ...state,
                isOpenFormOpenFolder: action.payload
            };
        case Action.SET_OPEN_FORM_EDIT_SPACE:
            return {
                ...state,
                isOpenFormEditSpace: action.payload
            };
        case Action.SET_OPEN_FORM_CHANGE_COLOR_PROJECT:
            return {
                ...state,
                isOpenFormChangeColorProject: action.payload
            };
        default:
            return state;
    }
};

export default dialogReducer;
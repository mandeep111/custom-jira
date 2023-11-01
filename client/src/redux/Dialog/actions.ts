import { Action } from './type';

export const setOpenFormNewSpace = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_NEW_SPACE,
        payload: isOpen
    };
};

export const setOpenFormNewProject = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_NEW_PROJECT,
        payload: isOpen
    };
};

export const setOpenFormNewFolder = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_NEW_FOLDER,
        payload: isOpen
    };
};

export const setOpenFormNewTask = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_NEW_TASK,
        payload: isOpen
    };
};

export const setOpenFormNewSubTask = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_NEW_SUB_TASK,
        payload: isOpen
    };
};

export const setOpenFormTaskDetail = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_TASK_DETAIL,
        payload: isOpen
    };
};

export const setOpenFormSubTaskDetail = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_SUB_TASK_DETAIL,
        payload: isOpen
    };
};

export const setOpenFormRenameSpace = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_RENAME_SPACE,
        payload: isOpen
    };
};

export const setOpenFormChangeColorSpace = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_CHANGE_COLOR_SPACE,
        payload: isOpen
    };
};

export const setOpenFormPlatformShare = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_PLATFORM_SHARE,
        payload: isOpen
    };
};

export const setOpenFormRenameProject = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_RENAME_PROJECT,
        payload: isOpen
    };
};

export const setOpenFormMoveProject = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_MOVE_PROJECT,
        payload: isOpen
    };
};

export const setOpenFormRenameFolder = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_RENAME_FOLDER,
        payload: isOpen
    };
};

export const setOpenFormMoveFolder = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_MOVE_FOLDER,
        payload: isOpen
    };
};

export const setOpenFormOpenFolder = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_OPEN_FOLDER,
        payload: isOpen
    };
};

export const setOpenFormEditSpace = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_EDIT_SPACE,
        payload: isOpen
    };
};

export const setOpenFormChangeColorProject = (isOpen: boolean | null) => {
    return {
        type: Action.SET_OPEN_FORM_CHANGE_COLOR_PROJECT,
        payload: isOpen
    };
};
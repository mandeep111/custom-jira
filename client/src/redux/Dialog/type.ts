export interface State {
    isOpenFormNewSpace: boolean;
    isOpenFormNewProject: boolean;
    isOpenFormNewFolder: boolean;
    isOpenFormNewTask: boolean;
    isOpenFormNewSubTask: boolean;
    isOpenFormTaskDetail: boolean;
    isOpenFormSubTaskDetail: boolean;
    isOpenFormRenameSpace: boolean;
    isOpenFormChangeColorSpace: boolean;
    isOpenFormPlatformShare: boolean;
    isOpenFormRenameProject: boolean;
    isOpenFormMoveProject: boolean;
    isOpenFormRenameFolder: boolean;
    isOpenFormMoveFolder: boolean;
    isOpenFormOpenFolder: boolean;
    isOpenFormEditSpace: boolean;
    isOpenFormChangeColorProject: boolean;
}

export enum Action {
    SET_OPEN_FORM_NEW_SPACE = 'SET_OPEN_FORM_NEW_SPACE',
    SET_OPEN_FORM_NEW_PROJECT = 'SET_OPEN_FORM_NEW_PROJECT',
    SET_OPEN_FORM_NEW_FOLDER = 'SET_OPEN_FORM_NEW_FOLDER',
    SET_OPEN_NEW_TASK = 'SET_OPEN_NEW_TASK',
    SET_OPEN_FORM_NEW_SUB_TASK = 'SET_OPEN_FORM_NEW_SUB_TASK',
    SET_OPEN_FORM_TASK_DETAIL = 'SET_OPEN_FORM_TASK_DETAIL',
    SET_OPEN_FORM_SUB_TASK_DETAIL = 'SET_OPEN_FORM_SUB_TASK_DETAIL',
    SET_OPEN_FORM_RENAME_SPACE = 'SET_OPEN_FORM_RENAME_SPACE',
    SET_OPEN_FORM_CHANGE_COLOR_SPACE = 'SET_OPEN_FORM_CHANGE_COLOR_SPACE',
    SET_OPEN_FORM_PLATFORM_SHARE = 'SET_OPEN_FORM_PLATFORM_SHARE',
    SET_OPEN_FORM_RENAME_PROJECT = 'SET_OPEN_FORM_RENAME_PROJECT',
    SET_OPEN_FORM_MOVE_PROJECT = 'SET_OPEN_FORM_MOVE_PROJECT',
    SET_OPEN_FORM_RENAME_FOLDER = 'SET_OPEN_FORM_RENAME_FOLDER',
    SET_OPEN_FORM_MOVE_FOLDER = 'SET_OPEN_FORM_MOVE_FOLDER',
    SET_OPEN_FORM_OPEN_FOLDER = 'SET_OPEN_FORM_OPEN_FOLDER',
    SET_OPEN_FORM_EDIT_SPACE = 'SET_OPEN_FORM_EDIT_SPACE',
    SET_OPEN_FORM_CHANGE_COLOR_PROJECT = 'SET_OPEN_FORM_CHANGE_COLOR_PROJECT'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
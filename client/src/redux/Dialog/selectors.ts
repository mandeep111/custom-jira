import { RootState } from '../rootReducer';

export const getOpenFormNewSpace = (state: RootState) => {
    return state.dialog.isOpenFormNewSpace;
};

export const getOpenFormNewProject = (state: RootState) => {
    return state.dialog.isOpenFormNewProject;
};

export const getOpenFormNewFolder = (state: RootState) => {
    return state.dialog.isOpenFormNewFolder;
};

export const getOpenFormNewTask = (state: RootState) => {
    return state.dialog.isOpenFormNewTask;
};

export const getOpenFormNewSubTask = (state: RootState) => {
    return state.dialog.isOpenFormNewSubTask;
};

export const getOpenFormTaskDetail = (state: RootState) => {
    return state.dialog.isOpenFormTaskDetail;
};

export const getOpenFormSubTaskDetail = (state: RootState) => {
    return state.dialog.isOpenFormSubTaskDetail;
};

export const getOpenFormRenameSpace = (state: RootState) => {
    return state.dialog.isOpenFormRenameSpace;
};

export const getOpenFormChangeColorSpace = (state: RootState) => {
    return state.dialog.isOpenFormChangeColorSpace;
};

export const getOpenFormPlatformShare = (state: RootState) => {
    return state.dialog.isOpenFormPlatformShare;
};

export const getOpenFormRenameProject = (state: RootState) => {
    return state.dialog.isOpenFormRenameProject;
};

export const getOpenFormMoveProject = (state: RootState) => {
    return state.dialog.isOpenFormMoveProject;
};

export const getOpenFormRenameFolder = (state: RootState) => {
    return state.dialog.isOpenFormRenameFolder;
};

export const getOpenFormMoveFolder = (state: RootState) => {
    return state.dialog.isOpenFormMoveFolder;
};

export const getOpenFormOpenFolder = (state: RootState) => {
    return state.dialog.isOpenFormOpenFolder;
};

export const getOpenFormEditSpace = (state: RootState) => {
    return state.dialog.isOpenFormEditSpace;
};

export const getOpenFormChangeColorProject = (state: RootState) => {
    return state.dialog.isOpenFormChangeColorProject;
};
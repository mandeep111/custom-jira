import { Action } from './type';

export const setEditSpace = (editMode: boolean) => {
    return {
        type: Action.SET_EDIT_SPACE,
        payload: editMode
    };
};

export const setEditTaskDate = (editMode: boolean) => {
    return {
        type: Action.SET_EDIT_TASK_DATE,
        payload: editMode
    };
};
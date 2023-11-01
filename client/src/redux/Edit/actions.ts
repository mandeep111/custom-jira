import { Action } from './type';

export const setEditSpace = (editMode: boolean) => {
    return {
        type: Action.SET_EDIT_SPACE,
        payload: editMode
    };
};
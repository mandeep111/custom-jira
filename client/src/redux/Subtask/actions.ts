import { Action } from './type';

export const setSubtaskId = (subtaskId: number | null) => {
    return {
        type: Action.SET_SUBTASK_ID,
        payload: subtaskId
    };
};
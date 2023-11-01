import { Action } from './type';

export const setTaskId = (taskId: number | null) => {
    return {
        type: Action.SET_TASK_ID,
        payload: taskId
    };
};

export const setSearch = (search: string) => {
    return {
        type: Action.SET_SEARCH,
        payload: search
    };
};
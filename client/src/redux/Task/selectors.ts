import { RootState } from '../rootReducer';

export const getTaskId = (state: RootState) => {
    return state.task.taskId;
};

export const getSearch = (state: RootState) => {
    return state.task.search;
};

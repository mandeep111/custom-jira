import { RootState } from '../rootReducer';

export const getEditSpace = (state: RootState) => {
    return state.edit.space;
};

export const getEditTaskDate = (state: RootState) => {
    return state.edit.taskDate;
};
import { RootState } from '../rootReducer';

export const getSubtaskId = (state: RootState) => {
    return state.subtask.subtaskId;
};

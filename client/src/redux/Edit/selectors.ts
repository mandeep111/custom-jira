import { RootState } from '../rootReducer';

export const getEditSpace = (state: RootState) => {
    return state.edit.space;
};
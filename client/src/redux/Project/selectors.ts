import { RootState } from '../rootReducer';

export const getIsCheckFilter = (state: RootState) => {
    return state.project.isCheckFilter;
};

export const getIsCheckMe = (state: RootState) => {
    return state.project.isCheckMe;
};

export const getSortDir = (state: RootState) => {
    return state.project.sortDir;
};

export const getIsCheckShow = (state: RootState) => {
    return state.project.isCheckShow;
};
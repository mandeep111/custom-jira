import { Action } from './type';

export const setIsCheckFilter = (isCheck: boolean) => {
    return {
        type: Action.SET_IS_CHECK_FILTER,
        payload: isCheck
    };
};

export const setIsCheckMe = (isCheck: boolean) => {
    return {
        type: Action.SET_IS_CHECK_ME,
        payload: isCheck
    };
};

export const setSortDir = (sort: 'asc' | 'desc') => {
    return {
        type: Action.SET_SORT_DIR,
        payload: sort
    };
};

export const setIsCheckShow = (isCheck: boolean) => {
    return {
        type: Action.SET_IS_CHECK_SHOW,
        payload: isCheck
    };
};
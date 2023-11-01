export interface State {
    isCheckFilter: boolean;
    isCheckMe: boolean;
    sortDir: 'asc' | 'desc';
    isCheckShow: boolean;
}

export enum Action {
    SET_IS_CHECK_FILTER = 'SET_IS_CHECK_FILTER',
    SET_IS_CHECK_ME = 'SET_IS_CHECK_ME',
    SET_SORT_DIR = 'SET_SORT_DIR',
    SET_IS_CHECK_SHOW = 'SET_IS_CHECK_SHOW'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
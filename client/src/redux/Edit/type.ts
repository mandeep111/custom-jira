export interface State {
    space: boolean;
    taskDate: boolean;
}

export enum Action {
    SET_EDIT_SPACE = 'SET_EDIT_SPACE',
    SET_EDIT_TASK_DATE = 'SET_EDIT_TASK_DATE'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
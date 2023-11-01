export interface State {
    taskId: number | null;
    search: string;
}

export enum Action {
    SET_TASK_ID = 'SET_TASK_ID',
    SET_SEARCH = 'SET_SEARCH'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
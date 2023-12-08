export interface State {
    subtaskId: number | null;
}

export enum Action {
    SET_SUBTASK_ID = 'SET_SUBTASK_ID'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
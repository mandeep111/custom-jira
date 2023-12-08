export interface State {
    content: User[];
}

export enum Action {
    SET_USER = 'SET_USER'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
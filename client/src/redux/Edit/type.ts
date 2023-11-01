export interface State {
    space: boolean;
}

export enum Action {
    SET_EDIT_SPACE = 'SET_EDIT_SPACE'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
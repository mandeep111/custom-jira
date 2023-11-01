export interface State {
    theme: 'dark' | 'light';
}

export enum Action {
    SET_THEME = 'SET_THEME'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
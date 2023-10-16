export interface State {
    id: number | null;
    fullName: string;
    email: string;
}

export enum Action {
    SET_USER = 'SET_USER'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
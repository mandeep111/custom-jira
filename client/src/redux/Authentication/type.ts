export interface State {
    token: string | null;
    userId: number | null;
    expirationDate: number | null;
}

export enum Action {
    SET_TOKEN = 'SET_TOKEN',
    SET_USER_ID = 'SET_USER_ID',
    SET_EXPIRATION_DATE = 'SET_EXPIRATION_DATE'
}

export interface ActionInterface {
    type: Action;
    payload: unknown;
}
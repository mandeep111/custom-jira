import { Action } from './type';

export const setToken = (token: string | null) => {
    return {
        type: Action.SET_TOKEN,
        payload: token
    };
};

export const setExpirationDate = (expirationDate: number | null) => {
    return {
        type: Action.SET_EXPIRATION_DATE,
        payload: expirationDate
    };
};
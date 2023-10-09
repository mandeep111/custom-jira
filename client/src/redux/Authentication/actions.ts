import { Action } from './type';

export const setToken = (token: string | null) => {
    return {
        type: Action.SET_TOKEN,
        payload: token
    };
};

export const setUserId = (userId: number | null) => {
    return {
        type: Action.SET_USER_ID,
        payload: userId
    };
};

export const setExpirationDate = (expirationDate: number | null) => {
    return {
        type: Action.SET_EXPIRATION_DATE,
        payload: expirationDate
    };
};
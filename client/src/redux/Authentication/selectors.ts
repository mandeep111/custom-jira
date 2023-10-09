import { RootState } from '../rootReducer';

export function getToken(state: RootState) {
    return state.authentication.token;
}

export function getUserId(state: RootState) {
    return state.authentication.userId;
}

export function getExpirationDate(state: RootState) {
    return state.authentication.expirationDate;
}
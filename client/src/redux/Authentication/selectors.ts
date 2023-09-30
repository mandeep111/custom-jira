import { RootState } from '../rootReducer';

export function getToken(state: RootState) {
    return state.authentication.token;
}

export function getExpirationDate(state: RootState) {
    return state.authentication.expirationDate;
}
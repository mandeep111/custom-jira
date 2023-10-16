import { RootState } from '../rootReducer';

export function getUser(state: RootState) {
    return state.user;
}
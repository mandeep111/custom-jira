import { Action, State } from './type';

export const setUser = (user: State[]) => {
    return {
        type: Action.SET_USER,
        payload: user
    };
};
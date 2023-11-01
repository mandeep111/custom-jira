import { Action } from './type';

export const setTheme = (theme: 'dark' | 'light') => {
    return {
        type: Action.SET_THEME,
        payload: theme
    };
};
import { RootState } from '../rootReducer';

export const getTheme = (state: RootState) => {
    return state.theme.theme;
};
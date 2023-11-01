import { Action, ActionInterface, State } from './type';

const initialState: State = {
    theme: 'light'
};

const themeReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case Action.SET_THEME:
            return {
                ...state,
                theme: action.payload
            };
        default:
            return state;
    }
};

export default themeReducer;
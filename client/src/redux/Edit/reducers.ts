import { Action, ActionInterface, State } from './type';

const initialState = {
    space: false
};

const editReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case Action.SET_EDIT_SPACE:
            return {
                ...state,
                space: action.payload
            };
        default:
            return state;
    }
};

export default editReducer;
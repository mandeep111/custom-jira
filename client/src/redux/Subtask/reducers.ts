import { Action, ActionInterface, State } from './type';

const initialState = {
    subtaskId: null
};

const subtaskReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case Action.SET_SUBTASK_ID:
            return {
                ...state,
                subtaskId: action.payload
            };
        default:
            return state;
    }
};

export default subtaskReducer;
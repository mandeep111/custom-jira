import { Action, ActionInterface, State } from './type';

const initialState = {
    taskId: null,
    search: ''
};

const taskReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case Action.SET_TASK_ID:
            return {
                ...state,
                taskId: action.payload
            };
        case Action.SET_SEARCH:
            return {
                ...state,
                search: action.payload
            };
        default:
            return state;
    }
};

export default taskReducer;
import { Action, ActionInterface, State } from './type';

const initialState: State = {
    isCheckFilter: false,
    isCheckMe: false,
    sortDir: 'asc',
    isCheckShow: false
};

const projectReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case Action.SET_IS_CHECK_FILTER:
            return {
                ...state,
                isCheckFilter: action.payload
            };
        case Action.SET_IS_CHECK_ME:
            return {
                ...state,
                isCheckMe: action.payload
            };
        case Action.SET_SORT_DIR:
            return {
                ...state,
                sortDir: action.payload
            };
        case Action.SET_IS_CHECK_SHOW:
            return {
                ...state,
                isCheckShow: action.payload
            };
        default:
            return state;
    }
};

export default projectReducer;
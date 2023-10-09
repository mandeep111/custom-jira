import { ActionInterface, State } from './type';


const initialState = {
    token: '',
    userId: null,
    expirationDate: null
};

const authenticationReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload
            };
        case 'SET_USER_ID':
            return {
                ...state,
                userId: action.payload
            };
        case 'SET_EXPIRATION_DATE':
            return {
                ...state,
                expirationDate: action.payload
            };
        default:
            return state;
    }
};

export default authenticationReducer;
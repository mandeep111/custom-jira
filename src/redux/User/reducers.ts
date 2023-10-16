import { ActionInterface, State } from './type';

const initialState = {
    id: null,
    fullName: '',
    email: ''
};

const userReducer = (state: State = initialState, action: ActionInterface) => {
    switch (action.type) {
        case 'SET_USER':
            return action.payload;
        default:
            return state;
    }
};

export default userReducer;
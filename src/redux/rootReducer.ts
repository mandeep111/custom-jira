import { combineReducers } from 'redux';
import authenticationReducer from './Authentication/reducers';
import { State as Authentication } from './Authentication/type';
import userReducer from './User/reducers';
import { State as User } from './User/type';

export interface RootState {
    authentication: Authentication;
    user: User;
}

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    user: userReducer
});

export default rootReducer;
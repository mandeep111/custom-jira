import authenticationReducer from './Authentication/reducers';
import { combineReducers } from 'redux';
import { State as Authentication } from './Authentication/type';

export interface RootState {
    authentication: Authentication;
}

const rootReducer = combineReducers({
    authentication: authenticationReducer
});

export default rootReducer;
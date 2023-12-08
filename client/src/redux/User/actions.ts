import axios from 'axios';
import { Dispatch } from 'redux';
import { Action, State } from './type';

export const setUser = (pageSize: number) => {
    return async (dispatch: Dispatch) => {
        try {
            if (typeof pageSize !== 'number' || isNaN(pageSize)) {
                pageSize = 5;
            }
            const response = await axios.get(`${SERVER.API.USER}/page?pageSize=${pageSize}`);
            dispatch({
                type: Action.SET_USER,
                payload: response.data as State[]
            });
        } catch (error) {
            throw new Error(error as string);
        }
    };
};

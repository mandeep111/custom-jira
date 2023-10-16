import axios, { AxiosResponse } from 'axios';
import { API } from '../utils/api';

interface HeaderConfig {
    headers?: {
        Authorization?: string,
        'Content-Type'?: 'application/json',
    },
    responseType?: 'blob'
}

export const update = async <T>(id: number, stateId: number, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T, T> = await axios.get(`${API.TASK}/change/${id}/${stateId}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};
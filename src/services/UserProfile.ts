import axios, { AxiosResponse } from 'axios';
import { API } from '../utils/api';

interface HeaderConfig {
    headers?: {
        Authorization?: string,
        'Content-Type'?: 'application/json',
    },
    responseType?: 'blob'
}

export const getUserProfiles = async <T>(config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.USER_PROFILE}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};


export const getMySubTasks = async <T>(config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.USER_PROFILE}/my-sub-tasks`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const getMyTasks = async <T>(config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.USER_PROFILE}/my-tasks`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};


export const getMyProjects = async <T>(config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.USER_PROFILE}/my-projects`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};


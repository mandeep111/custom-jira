import axios, { AxiosResponse } from 'axios';
import { API } from '../utils/api';

interface HeaderConfig {
    headers?: {
        Authorization?: string,
        'Content-Type'?: 'application/json',
    },
    responseType?: 'blob'
}

export const save = async <T,>(data: T, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T, T> = await axios.post(API.SUBTASK, data, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const updateAssignState = async <T>(id: number, assignId: number, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T, T> = await axios.get(`${API.SUBTASK}/add-assignee/${id}/${assignId}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const updateStatusState = async <T>(data:T,config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T, T> = await axios.post(`${API.SUBTASK}/change-status`, data, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};


export const getSUBTASKAll = async <T>(config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.SUBTASK}/all`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const getById = async <T>(id: number, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.SUBTASK}/${id}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};
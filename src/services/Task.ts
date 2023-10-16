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
        const response: AxiosResponse<T, T> = await axios.post(API.TASK, data, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const updateAssignState = async <T>(id: number, assignId: number, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T, T> = await axios.get(`${API.TASK}/add-assignee/${id}/${assignId}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};


export const getTaskAll = async <T>(config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.TASK}/all`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const getById = async <T>(id: number, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.TASK}/${id}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const duplicate = async <T>(taskId: number, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.get(`${API.TASK}/duplicate/${taskId}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const deleteTask = async <T>(taskId: number, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T> = await axios.delete(`${API.TASK}/${taskId}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};

export const removeAssignState = async <T>(id: number, assignId: number, config: HeaderConfig) => {
    try {
        const response: AxiosResponse<T, T> = await axios.delete(`${API.TASK}/remove-assignee/${id}/${assignId}`, config);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred: ${error as string}`);
    }
};
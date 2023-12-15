import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthorize = () => {

    const navigate = useNavigate();
    const sessionTime = Number(localStorage.getItem('session_expiration_time'));
    const userId = localStorage.getItem('keycloak_user_id');

    React.useEffect(() => {
        const getSessionId = async () => {
            if (userId) {
                try {
                    const response: AxiosResponse<string[]> = await axios.get(`${SERVER.API.KEYCLOAK}/sessions/${userId}`);
                    if (response.data.length === 0) {
                        navigate('/logout');
                    }
                } catch (error) {
                    throw new Error(error as string);
                }
            }
        };
        void getSessionId();
        if (sessionTime !== 0) {
            const timeoutId = setTimeout(() => {
                navigate('/logout');
            }, sessionTime);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [userId]);

};

export default useAuthorize;